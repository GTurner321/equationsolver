<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Equation Solver</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 20px;
        }

        .equation {
            font-size: 2rem;
            margin-bottom: 20px;
        }

        .container {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin-top: 20px;
        }

        .options {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
        }

        .option, .drop-box {
            width: 80px;
            height: 80px;
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

        .feedback {
            margin-top: 20px;
            font-size: 1.5rem;
            color: #333;
        }

        .success {
            color: green;
        }

        .error {
            color: red;
        }
    </style>
</head>
<body>
    <div class="equation">2x + 1 = 9</div>

    <div class="container">
        <div class="options">
            <div class="option" draggable="true" id="option1">-1</div>
            <div class="option" draggable="true" id="option2">+1</div>
            <div class="option" draggable="true" id="option3">/2</div>
        </div>

        <div class="drop-box" id="dropBox">Drop here</div>

        <div class="feedback" id="feedback"></div>
    </div>

    <script>
        const options = document.querySelectorAll('.option');
        const dropBox = document.getElementById('dropBox');
        const feedback = document.getElementById('feedback');

        // When dragging starts
        options.forEach(option => {
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

            // Check if the answer is correct
            if (droppedElement.textContent === '-1') {
                feedback.textContent = 'Correct! 2x = 8';
                feedback.classList.remove('error');
                feedback.classList.add('success');
                dropBox.textContent = droppedElement.textContent; // Show the dropped option
            } else {
                feedback.textContent = 'Wrong answer. Try again!';
                feedback.classList.remove('success');
                feedback.classList.add('error');
            }
        });
    </script>
</body>
</html>



