const buttons = document.querySelectorAll('.lock-button');

buttons.forEach(function(button) {
  const imageElement = button.querySelector('.lock-status');

  button.addEventListener('click', function() {
    console.log(button.textContent)
    console.log(imageElement.src)

    if (button.textContent == 'Lock') {
        button.textContent = 'Unlock';
      imageElement.src = 'assets/icons/lock-key.svg';
    } else if (button.textContent == 'Unlock'){
        button.textContent = 'Lock';
      imageElement.src = 'assets/icons/lock-key-open.svg';
    }
  });
});

// console log is telling me that both the image and text are updating as desired but the live server is making the image 
// vanish when the text updates and the text stays the same when only the image updates. Committing at this stage to see if
// the regular browser works differently.