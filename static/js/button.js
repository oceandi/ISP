document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.querySelector('.assistant-file-upload input[type="file"]');
    const uploadBtn = document.querySelector('.assistant-file-upload');
  
    uploadBtn.addEventListener('click', function() {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
      // Dosya(lar) seçildiğinde burada işleme koyabilirsiniz
      // Örneğin, dosyayı bir form ile sunucuya yüklemek için veya önizleme yapmak için
    });
  });