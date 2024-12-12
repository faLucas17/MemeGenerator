const imageInput = document.getElementById('imageInput');
const topText = document.getElementById('topText');
const bottomText = document.getElementById('bottomText');
const generateButton = document.getElementById('generateButton');
const downloadButton = document.getElementById('downloadButton');
const shareButton = document.getElementById('shareButton');
const memeCanvas = document.getElementById('memeCanvas');
const ctx = memeCanvas.getContext('2d');
const memeGallery = document.getElementById('memeGallery');

let currentImage = null;

// Charger l'image
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        currentImage = img;

        img.onload = () => {
            const maxCanvasWidth = 500;  // Largeur maximale du canvas
            const maxCanvasHeight = 500; // Hauteur maximale du canvas

            let newWidth = img.width;
            let newHeight = img.height;

            // Redimensionner uniquement si l'image dépasse les dimensions maximales
            if (img.width > maxCanvasWidth || img.height > maxCanvasHeight) {
                const scaleWidth = maxCanvasWidth / img.width;
                const scaleHeight = maxCanvasHeight / img.height;
                const scale = Math.min(scaleWidth, scaleHeight);

                newWidth = img.width * scale;
                newHeight = img.height * scale;
            }

            // Redimensionner le canvas et dessiner l'image
            memeCanvas.width = newWidth;
            memeCanvas.height = newHeight;

            ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height); // Effacer le canvas
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
        };
    };

    if (file) reader.readAsDataURL(file);
});

// Générer le mème
generateButton.addEventListener('click', () => {
    if (!currentImage) {
        alert('Veuillez d\'abord charger une image.');
        return;
    }

    ctx.drawImage(currentImage, 0, 0, memeCanvas.width, memeCanvas.height);

    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';

    // Texte en haut
    ctx.fillText(topText.value, memeCanvas.width / 2, 40);
    ctx.strokeText(topText.value, memeCanvas.width / 2, 40);

    // Texte en bas
    ctx.fillText(bottomText.value, memeCanvas.width / 2, memeCanvas.height - 20);
    ctx.strokeText(bottomText.value, memeCanvas.width / 2, memeCanvas.height - 20);

    addToGallery();
});

// Télécharger le mème
downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = memeCanvas.toDataURL();
    link.click();
});

// Partager le mème
shareButton.addEventListener('click', async () => {
    if (navigator.share) {
        const dataUrl = memeCanvas.toDataURL();
        const blob = await fetch(dataUrl).then(res => res.blob());
        const file = new File([blob], 'meme.png', { type: 'image/png' });

        navigator.share({
            files: [file],
            title: 'Mon mème',
            text: 'Regardez mon mème !'
        }).catch(err => console.log(err));
    } else {
        alert('La fonctionnalité de partage n\'est pas prise en charge par votre navigateur.');
    }
});

// Ajouter le mème à la galerie
function addToGallery() {
    const container = document.createElement('div');
    container.style.textAlign = 'center';
    container.style.marginBottom = '20px';

    const img = document.createElement('img');
    img.src = memeCanvas.toDataURL();
    img.style.maxWidth = '100px';
    img.style.border = '1px solid #ddd';
    img.style.borderRadius = '5px';

    const topTextElement = document.createElement('p');
    topTextElement.textContent = topText.value;
    topTextElement.style.margin = '5px 0';
    topTextElement.style.fontSize = '12px';
    topTextElement.style.color = 'black';

    const bottomTextElement = document.createElement('p');
    bottomTextElement.textContent = bottomText.value;
    bottomTextElement.style.margin = '5px 0';
    bottomTextElement.style.fontSize = '12px';
    bottomTextElement.style.color = 'black';

    container.appendChild(topTextElement);
    container.appendChild(img);
    container.appendChild(bottomTextElement);
    memeGallery1.appendChild(container);
}
