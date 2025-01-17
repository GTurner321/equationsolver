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

        .additional-options {
            margin-top: 40px;
            display: none;
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

    <div class="additional-options" id="additionalOptions">
        <div class="equation">2x = 8</div>
        <div class="options">
            <div class="option" draggable="true" id="option4">/2</div>
            <div class="option" draggable="true" id="option5">x2</div>
            <div class="option" draggable="true" id="option6">-x</div>
        </div>

        <div class="drop-box" id="dropBox2">Drop here</div>
        <div class="feedback" id="feedback2"></div>
    </div>

    <script>
        const options = document.querySelectorAll('.option');
        const dropBox = document.getElementById('dropBox');
        const feedback = document.getElementById('feedback');

        // Step 1: Solving 2x + 1 = 9
        options.forEach(option => {
            option.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', option.id);
            });
        });

        dropBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropBox.classList.add('hovered');
        });

        dropBox.addEventListener('dragleave', () => {
            dropBox.classList.remove('hovered');
        });

        dropBox.addEventListener('drop', (e) => {
            e.preventDefault();
            dropBox.classList.remove('hovered');
            const droppedId = e.dataTransfer.getData('text');
            const droppedElement = document.getElementById(droppedId);

            if (droppedElement.textContent === '-1') {
                feedback.textContent = 'Correct! 2x = 8';
                feedback.classList.remove('error');
                feedback.classList.add('success');
                dropBox.textContent = droppedElement.textContent;
                showAdditionalOptions();
            } else {
                feedback.textContent = 'Wrong answer. Try again!';
                feedback.classList.remove('success');
                feedback.classList.add('error');
            }
        });

        // Step 2: Solving 2x = 8
        function showAdditionalOptions() {
            const additionalOptions = document.getElementById('additionalOptions');
            additionalOptions.style.display = 'block';
        }

        const additionalOptions = document.querySelectorAll('.additional-options .option');
        const dropBox2 = document.getElementById('dropBox2');
        const feedback2 = document.getElementById('feedback2');

        additionalOptions.forEach(option => {
            option.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', option.id);
            });
        });

        dropBox2.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropBox2.classList.add('hovered');
        });

        dropBox2.addEventListener('dragleave', () => {
            dropBox2.classList.remove('hovered');
        });

        dropBox2.addEventListener('drop', (e) => {
            e.preventDefault();
            dropBox2.classList.remove('hovered');
            const droppedId = e.dataTransfer.getData('text');
            const droppedElement = document.getElementById(droppedId);

            if (droppedElement.textContent === '/2') {
                feedback2.textContent = 'Correct! x = 4';
                feedback2.classList.remove('error');
                feedback2.classList.add('success');
                dropBox2.textContent = droppedElement.textContent;
            } else {
                feedback2.textContent = 'Wrong answer. Try again!';
                feedback2.classList.remove('success');
                feedback2.classList.add('error');
            }
        });
    </script>
</body>
</html>





