window.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  fileInput.addEventListener('change', handleFileInputChange);

  async function handleFileInputChange(event) {
    const file = event.target.files[0];

    if (!file) {
      alert('Por favor, selecciona una imagen.');
      return;
    }

    const imgElement = document.getElementById('previewImage');
    imgElement.src = URL.createObjectURL(file);
    imgElement.width = 300;
    imgElement.height = 300;

    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';
    resultContainer.appendChild(imgElement);
  }

  const analyzeButton = document.getElementById('analyzeButton');
  analyzeButton.addEventListener('click', analyzeImage);

  async function analyzeImage() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
      alert('Por favor, selecciona una imagen.');
      return;
    }

    const imgElement = document.getElementById('previewImage');

    const apiKey = 'AIzaSyDAdLZxa2GKqTexDGKc0hN3R585dhPIZGs'; // Reemplaza 'TU_CLAVE_DE_API' con tu clave de API de Google Cloud Vision

    // Configura la solicitud a la API de Google Cloud Vision
    const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    const requestData = {
      requests: [
        {
          image: {
            content: await getBase64Image(file),
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 5,
            },
          ],
        },
      ],
    };

    try {
      // Realiza la solicitud a la API de Google Cloud Vision
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData),
      });
      const result = await response.json();

      // Muestra los resultados en la página
      const resultText = document.getElementById('resultText');
      if (result.responses && result.responses.length > 0) {
        const labels = result.responses[0].labelAnnotations;
        if (labels && labels.length > 0) {
          const firstLabel = labels[0].description;
          resultText.textContent = `El objeto detectado es: ${firstLabel}`;
        } else {
          resultText.textContent = 'No se pudo detectar nada en la imagen.';
        }
      } else {
        resultText.textContent = 'No se pudo realizar la detección en la imagen.';
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      resultText.textContent = 'Error al realizar la solicitud a la API.';
    }
  }

  function getBase64Image(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
});
















