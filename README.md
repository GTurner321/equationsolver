<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            } else {
                feedback.textContent = 'Wrong answer. Try again!';
                feedback.classList.remove('success');
                feedback.classList.add('error');
            }
        });
    </script>
</body>
</html>




