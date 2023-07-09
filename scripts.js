const lockButtons = document.querySelectorAll('.lock-button');

lockButtons.forEach((button) => {
  const img = button.querySelector('.lock-status');

  button.addEventListener('click', () => {
    const isOpen = img.src.includes('lock-key-open.svg');
    img.src = isOpen ? 'assets/icons/lock-key.svg' : 'assets/icons/lock-key-open.svg';

    button.classList.toggle('open');
  });
});


const colorInput = document.getElementById('brand-colour-picker');

let colorValue = colorInput.value;

colorInput.addEventListener('input', () =>{
  document.getElementById('colorVal').textContent = colorInput.value;
});

