// Create a new image object
const image = new Image();
// Create a container element
const app = document.getElementById('app');
const container = document.createElement('div');

// Create an array to store the puzzle pieces
let puzzle = [];
// Create an array to store the original puzzle
let originalPuzzle = [];

// Define the pieces array to hold the image data for each puzzle piece
const pieces = [];


function createPuzzle(event) {
    // Set the image source to the data URL of the selected image
    image.src = 'assets/tree.jpg';
    image.crossOrigin = 'anonymous'; // Allow the image to be accessed from a different origin
    // When the image is loaded, call the `drawPuzzle` function
    image.onload = drawPuzzle;
}

function drawPuzzle() {
    // Get the width and height of the image
    const width = image.width;
    const height = image.height;
    // Divide the image into 3x3 pieces
    const blocks = 3;
    const pieceWidth = width / blocks;
    const pieceHeight = height / blocks;
    // Create a canvas element
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

// save the original puzzle
function saveOriginalPuzzle() {
    originalPuzzle = [...puzzle];
    console.log('original puzzle:', originalPuzzle);
}

//    Copy code
for (let i = 0; i < pieces.length; i++) {
    puzzle.push({
        id: i,
        src: pieces[i],
        position: i,
    });
}

saveOriginalPuzzle();

// render the puzzle pieces
const renderPuzzle = () => {

  };

//render puzzle pieces to the container
const updatePuzzle = () => {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    const updatedPuzzle = renderPuzzle();
    updatedPuzzle.forEach(piece => container.appendChild(piece));
};

updatePuzzle();

//drag and drop event handlers
function handleDragStart(event) {
    // Store the id of the dragged element in the data transfer object
    event.dataTransfer.setData("pieceId", event.target.id);
    event.dataTransfer.setData("position", event.target.getAttribute("data-position"));
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();

    // Get the id of the dragged element and the element it was dropped on
    const draggedElementId = event.dataTransfer.getData("pieceId");
    const dropTargetElement = event.target;

    // Swap the src and position attributes of the dragged element and the element it was dropped on
    const draggedElement = document.getElementById(draggedElementId);
    const tempId = draggedElement.id;
    const tempSrc = draggedElement.src;
    const tempPosition = draggedElement.getAttribute("data-position");
    draggedElement.id = dropTargetElement.id;

    draggedElement.src = dropTargetElement.src;
    draggedElement.setAttribute("data-position", dropTargetElement.getAttribute("data-position"));
    dropTargetElement.id = tempId;
    dropTargetElement.src = tempSrc;
    dropTargetElement.setAttribute("data-position", tempPosition);

    // Update the puzzle array
    puzzle.find(p => p.id == tempId).id = Number(draggedElement.id);
    puzzle.find(p => p.id == draggedElement.id).id = Number(tempId);
    puzzle.find(p => p.id == tempId).src = tempSrc;
    puzzle.find(p => p.id == draggedElement.id).src = draggedElement.src;
    puzzle.find(p => p.id == tempId).position = Number(tempPosition);
    puzzle.find(p => p.id == draggedElement.id).position = Number(draggedElement.getAttribute("data-position"));

    // Check if the puzzle has been solved
    if (checkIfSolved()) {
        alert("Congratulations, you solved the puzzle!");
    }
};

// Check if the puzzle is solved
function checkIfSolved() {
    for (let i = 0; i < puzzle.length; i++) {
        if (puzzle[i].position !== originalPuzzle[i].position) {
            return false;
        }
    }
    return true;
}

// Add event listeners to each puzzle piece
for (let i = 0; i < puzzlePieces.length; i++) {
    puzzlePieces[i].addEventListener("dragstart", handleDragStart);
    puzzlePieces[i].addEventListener("dragover", handleDragOver);
    puzzlePieces[i].addEventListener("drop", handleDrop);
}

// Add a button for getting a hint
const hintButton = document.createElement("button");
hintButton.innerHTML = "Get Hint";
hintButton.addEventListener("click", showHint);
app.appendChild(hintButton);

function showHint() {
    let hintPiece = originalPuzzle.find(p => p.position !== puzzle.find(p2 => p2.id === p.id).position);
    let currentPiece = puzzle.find(p => p.id === hintPiece.id);
    currentPiece.style.border = "2px solid red";
    setTimeout(() => {
        currentPiece.style.border = "0px";
    }, 2000);
}

document.onload = () => {
    let puzzlePieces = renderPuzzle();
    createPuzzle();
};