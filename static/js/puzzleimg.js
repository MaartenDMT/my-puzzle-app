const image = new Image();
image.crossOrigin = 'anonymous'; // Allow the image to be accessed from a different origin
image.src = 'assets/tree.jpg';

const app = document.getElementById('app');
const container = document.createElement('div');

let originalPuzzle;
const pieces = [];
const puzzle = [];
let hintArr = [];

image.onload = () => {
  const width = image.width;
  const height = image.height;
  const blocks = 3;
  const pieceWidth = width / blocks;
  const pieceHeight = height / blocks;



  if (image.naturalWidth === 0 || image.naturalHeight === 0) {
    console.error("Error loading image");
  } else {
    for (let x = 0; x < blocks; x++) {
      for (let y = 0; y < blocks; y++) {
        const canvas = document.createElement("canvas");
        canvas.width = pieceWidth;
        canvas.height = pieceHeight;
        // Append the canvas to the app element
        const context = canvas.getContext("2d");
        context.drawImage(
          image,
          x * pieceWidth,
          y * pieceHeight,
          pieceWidth,
          pieceHeight,
          0,
          0,
          pieceWidth,
          pieceHeight
        );
        const dataUrl = canvas.toDataURL();
        // img.src = dataUrl;
        // app.appendChild(img);
        pieces.push(dataUrl);

      }
    }
    function saveOriginalPuzzle() {
      for (let i = 0; i < pieces.length; i++) {
        puzzle.push({
          id: i,
          src: pieces[i],
          position: i,
        });
      }
      originalPuzzle = [...puzzle];
      console.log('original puzzle:', originalPuzzle);
    }


    saveOriginalPuzzle();

  }


  function checkIfSolved() {
    for (let i = 0; i < puzzle.length; i++) {
        console.log('checking solution:', puzzle[i])
        let originalPiece = originalPuzzle.find(p => p.id === puzzle[i].id && p.position === puzzle[i].position);
        if (!originalPiece) {
            return false;
        }
    }
    return true;
}

  container.className = 'container';
  app.appendChild(container);

  function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    console.log("shuffle",array)
    return array;
  }

  const renderPuzzle = () => {
    shuffle(puzzle);
    return puzzle.map(piece => {
      const img = document.createElement('img');
      img.src = piece.src;
      img.className = "puzzle-piece"; // Add a class name to each image element
      img.id = piece.id; // assign the id from the puzzle array
      img.setAttribute('position', piece.position);
      img.draggable = true;
      return img;
    });
    
  };


  const handleDragStart = event => {
    // Store the id of the dragged element in the data transfer object
    event.dataTransfer.setData('pieceId', event.target.id);
    event.dataTransfer.setData('position', event.target.getAttribute('position'));
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  const handleDrop = event => {
    event.preventDefault();

    // Get the id of the dragged element and the element it was dropped on
    const draggedElementId = event.dataTransfer.getData('pieceId');
    const dropTargetElement = event.target;

    // Swap the src and position attributes of the dragged element and the element it was dropped on
    const draggedElement = document.getElementById(draggedElementId);
    const tempSrc = draggedElement.src;
    const tempPosition = draggedElement.getAttribute('position');
    draggedElement.src = dropTargetElement.src;
    draggedElement.setAttribute('position', dropTargetElement.getAttribute('position'));
    dropTargetElement.src = tempSrc;
    dropTargetElement.setAttribute('position', tempPosition);

    //update the puzzle array
    puzzle.find(p => p.src == tempSrc).src = draggedElement.src;
    puzzle.find(p => p.src == draggedElement.src).src = tempSrc;
    puzzle.find(p => p.src == tempSrc).position = Number(tempPosition);
    puzzle.find(p => p.src == draggedElement.src).position = Number(draggedElement.getAttribute('position'));

  };


  const pPieces = renderPuzzle();

  pPieces.forEach(piece => container.appendChild(piece));

  // Add the event listeners to all puzzle pieces
  const puzzlePieces = document.querySelectorAll('.puzzle-piece');
  puzzlePieces.forEach(piece => {
    piece.addEventListener('dragstart', handleDragStart);
    piece.addEventListener('dragover', handleDragOver);
    piece.addEventListener('drop', handleDrop);
  });

  const hintButton = document.getElementById("hint-button");
  hintButton.addEventListener("click", showHint);

  const finishButton = document.getElementById("finish-button");
  finishButton.addEventListener("click", finsished);

  function showHint() {
    console.log("giving out a hint!")
    const hintPiece = originalPuzzle[Math.floor(Math.random() * originalPuzzle.length)];
    hintArr.push(hintPiece);
    const currentPiece = puzzle.find(p => p.id === hintPiece.id);
    if (currentPiece.position !== hintPiece.position) {
      currentPiece.style.border = "4px solid red";
      setTimeout(() => {
        currentPiece.style.border = "0px";
      }, 2000);
    }
  }

function finsished (){
      // Check if the puzzle has been solved;
    if (checkIfSolved()) {
      alert("Congratulations, you solved the puzzle!");
    }
}

};


