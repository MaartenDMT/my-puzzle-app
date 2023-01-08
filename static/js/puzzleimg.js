const image = new Image();
image.crossOrigin = 'anonymous'; // Allow the image to be accessed from a different origin
image.src = 'assets/tree.jpg';

const app = document.getElementById('app');
const container = document.createElement('div');

const pieces = [];
const puzzle = [];

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
  }
  for (let i = 0; i < pieces.length; i++) {
    puzzle.push({
      id: i + 1,
      src: pieces[i],
      position: i + 1,
    });
  }

  container.className = 'container';
  app.appendChild(container);


  const renderPuzzle = () => {
    return puzzle.map(piece => {
      const img = document.createElement('img');
      img.src = piece.src;
      img.id = Math.floor(Math.random() * puzzle.length) + 1;
      img.setAttribute('position',piece.position );
      img.draggable = true;
      return img;
    });
  };


  // const updatePuzzle = () => {
  //   while (container.firstChild) {
  //     container.removeChild(container.firstChild);
  //   }
  //   const updatedPuzzle = renderPuzzle();
  //   updatedPuzzle.forEach(piece => container.appendChild(piece));
  // };

  const handleDragStart = event => {
    // Store the id of the dragged element in the data transfer object
    event.dataTransfer.setData('pieceId', event.target.id);
    event.dataTransfer.setData('position', event.target.getAttribute('position'))
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  const handleDrop = event => {
    event.preventDefault();

    // Get the id of the dragged element and the element it was dropped on
    const draggedElementId = event.dataTransfer.getData('pieceId');
    const dropTargetElement = event.target;


    // Swap the src attributes of the dragged element and the element it was dropped on
    const draggedElement = document.getElementById(draggedElementId);
    const draggedElementPostion = draggedElement.getAttribute('position');
    const tempSrc = draggedElement.src;
    const tempElementPosition = draggedElementPostion

    draggedElement.src = dropTargetElement.src;
    draggedElementPostion = dropTargetElement.getAttribute('position')

    dropTargetElement.src = tempSrc;

    //Check if the puzzle has been solved
    if (puzzle.every(piece => piece.position === Number(document.getElementById(piece.id).getAttribute('position')))) {
      alert('Congratulations, you solved the puzzle!');
    }
  };



  const pPieces = renderPuzzle();
  console.log(pPieces);
  pPieces.forEach(piece => container.appendChild(piece));

  // Add the event listeners to all puzzle pieces
  const puzzlePieces = document.querySelectorAll('img');
  puzzlePieces.forEach(piece => {
    piece.addEventListener('dragstart', handleDragStart);
    piece.addEventListener('dragover', handleDragOver);
    piece.addEventListener('drop', handleDrop);
  });

};



