<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drag and Drop</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 20px;
        }

        .container {
            display: flex;
            justify-content: space-around;
            margin-top: 50px;
        }

        .option, .drop-box {
            width: 100px;
            height: 100px;
            border: 2px solid #333;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
            background-color: #f9f9f9;
            cursor: grab;
        }

        .option:active {
            cursor: grabbing;
        }

        .drop-box {
            border-style: dashed;
        }

        .drop-box.hovered {
            background-color: #e0ffe0;
            border-color: #00aa00;
        }

        .success {
            background-color: #d4edda;
            color: #155724;
            border-color: #c3e6cb;
        }
    </style>
</head>
<body>
    <h1>Drag and Drop Example</h1>
    <p>Drag the options and drop them into the empty box.</p>

    <div class="container">
        <div class="option" draggable="true" id="option1">+2</div>
        <div class="option" draggable="true" id="option2">+3</div>
        <div class="option" draggable="true" id="option3">+4</div>
    </div>

    <div class="container">
        <div class="drop-box" id="dropBox"></div>
    </div>

    <script>
        const options = document.querySelectorAll('.option');
        const dropBox = document.getElementById('dropBox');

        options.forEach(option => {
            // When dragging starts
            option.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', option.id); // Pass the dragged element's ID
            });
        });

        // When an item is dragged over the drop box
        dropBox.addEventListener('dragover', (e) => {
            e.preventDefault(); // Allow drop
            dropBox.classList.add('hovered'); // Highlight the drop box
        });

        // When the dragged item leaves the drop box
        dropBox.addEventListener('dragleave', () => {
            dropBox.classList.remove('hovered');
        });

        // When an item is dropped into the drop box
        dropBox.addEventListener('drop', (e) => {
            e.preventDefault();
            dropBox.classList.remove('hovered');

            const droppedId = e.dataTransfer.getData('text'); // Get the dragged element's ID
            const droppedElement = document.getElementById(droppedId);

            // Add the dragged element to the drop box
            if (!dropBox.classList.contains('success')) {
                dropBox.textContent = droppedElement.textContent;
                dropBox.classList.add('success');
            }
        });
    </script>
</body>
</html>


