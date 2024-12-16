document.addEventListener('DOMContentLoaded', function() {

  // Modalı al
  var modal = document.getElementById("settingsModal");
  
  // Kapatma butonunu al ("x" simgesi)
  var closeBtn = document.getElementsByClassName("close-macbtn")[0];

  updateSettingContent('account-info');
  // Ve account-info listesine 'active' sınıfını ekle
  var defaultActiveSetting = document.querySelector('.leftset ul li[data-setting="account-info"]');
  if(defaultActiveSetting) {
    defaultActiveSetting.classList.add('active');
  }
  
  // Ayarları aç butonu
  var openSettingsButton = document.querySelector("[data-action='open-settings']");
  if (openSettingsButton) {
    openSettingsButton.onclick = function() {
      modal.style.display = "block";
    }
  }
  
  // Kapatma butonuna tıklandığında modalı kapat
  closeBtn.onclick = function() {
    modal.style.display = "none";
  }
  
  // Modalın dışına tıklandığında kapat
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "block";
    }
  }
  
  // Sol kısımdaki her bir ayar öğesine tıklama işlevi ekle
  var settingsListItems = document.querySelectorAll('.leftset ul li');
  
  settingsListItems.forEach(function(item) {
    item.addEventListener('click', function() {
      // 'data-setting' özelliğini al
      var settingName = this.dataset.setting;
      // Sağ taraftaki içerik bölgesini güncelle
      updateSettingContent(settingName);
    });
  });
  
  function updateSettingContent(setting) {
    // Sağ taraftaki içerik bölgesini temsil eden elementi al
    var settingsContent = document.getElementById('settingsContent');
    
    document.querySelectorAll('.leftset ul li').forEach(function(li) {
      li.classList.remove('active');
    });
    
    // Aktif listedeki 'li' öğesine 'active' sınıfını ekle
    document.querySelector('.leftset ul li[data-setting="' + setting + '"]').classList.add('active');
    
    switch (setting) {
      case 'account-info':
        settingsContent.innerHTML = `
          <div class="sys1">
            <ul class="Subdad">
              <li class="Sub">GPT-4<label class="switch"><input type="checkbox"><span class="slider round"></span></label></li>
              <li class="Sub">Google Bard<label class="switch"><input type="checkbox"><span class="slider round"></span></label></li>
              <li class="Subb">T5<label class="switch"><input type="checkbox"><span class="slider round"></span></label></li>
          </div>
        `;
        break;
      case 'general':
        settingsContent.innerHTML = `
          <div class="sys1">
            <ul class="Subdad">
              <li class="Subb">About</li>
          </div>
        `;
        break;
      case 'appearance':
        settingsContent.innerHTML = `
          <div class="sys1">
            <ul class="Subdad">
              <li class="Sub">Appearance
                <button class="button-light" onclick="lightTheme()"></button>
                <button class="button-dark" onclick="darkTheme()"></button>
                <button class="button-auto" onclick="checkTimeAndSetTheme()"></button>
              </li>
              <li class="Sub">Accent color
                <div class="macbtnw extragapforappearancebtns">
                  <label class="label-class-accent">
                    <input type="radio" checked="checked" name="accent-color">
                    <span class="blue-btn"></span>
                  </label>
                  <label class="label-class-accent">
                    <input type="radio" name="accent-color">
                    <span class="purple-btn"></span>
                  </label>
                  <label class="label-class-accent">
                      <input type="radio" name="accent-color">
                      <span class="pink-btn"></span>
                  </label>
                  <label class="label-class-accent">
                      <input type="radio" name="accent-color">
                      <span class="red-btn"></span>
                  </label>
                  <label class="label-class-accent">
                      <input type="radio" name="accent-color">
                      <span class="orange-btn"></span>
                  </label>
                  <label class="label-class-accent">
                      <input type="radio" name="accent-color">
                      <span class="yellow-btn"></span>
                  </label>
                  <label class="label-class-accent">
                      <input type="radio" name="accent-color">
                      <span class="green-btn"></span>
                  </label>
                </div>
              </li>
              <li class="Sub">Highlight color
                <select id="Highlight" name="color">
                  <option value="accent-color">Accent Color</option>
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="pink">Pink</option>
                  <option value="red">Red</option>
                  <option value="orange">Orange</option>
                  <option value="yellow">Yellow</option>
                  <option value="green">Green</option>
                  <option value="graphite">Graphite</option>
                </select>
              </li>
              <li class="Subb">Allow wallpaper tinting in windows<label class="switch"><input type="checkbox"><span class="slider round"></span></label></li>
            </ul>
          </div>
          <div class="sys1">
            <ul class="Subdad no-li">Show scroll bars <br>
              <input type="radio" id="radio" name="scroll" value="auto">
              <label for="auto">Automatically based on mouse or trackpad</label><br>
              <input type="radio" id="radio" name="scroll" value="when">
              <label for="when">When scrolling</label><br>
              <input type="radio" id="radio" name="scroll" value="always">
              <label for="always">Always</label><br>
            </ul>
          </div>
        `;
        break;
      case 'accessibility':
        settingsContent.innerHTML = `
          <div class="sys1">
            <ul class="Subdad">
              <li class="Subb">Accessibility</li>
          </div>
        `;
        break;
      case 'wallpaper':
        settingsContent.innerHTML = `
          <div class="sys1">
            <ul class="Subdad">
              <li class="Subb">Wallpapers</li>
          </div>
        `;
        break;
      // Ve diğer ayarlar için de benzer şekilde içerik eklenebilir.
    }
  }

  var modal = document.getElementById('settingsModal');
  var header = document.querySelector('.modal-header');
  
  // İlk önce, tıklama ile sürükleme başlatılmasını sağlayacak değişkenleri tanımla
  var isDragging = false;
  var offset = { x: 0, y: 0 };
  
  header.addEventListener('mousedown', function(e) {
      isDragging = true;
      offset.x = e.clientX - modal.offsetLeft;
      offset.y = e.clientY - modal.offsetTop;
      e.preventDefault(); // Sürüklerken metin seçimini önle
  });
  
  document.addEventListener('mousemove', function(e) {
      if (isDragging) {
          // Mouse'ın şu anki konumundan offset'i çıkartarak modal'ın yeni konumunu hesapla
          var x = e.clientX - offset.x;
          var y = e.clientY - offset.y;
  
          // Modal'ın stilini güncelle
          modal.style.left = x + 'px';
          modal.style.top = y + 'px';
      }
  });
  
  document.addEventListener('mouseup', function() {
      // Sürükleme bittiğinde, isDragging'i false yap
      isDragging = false;
  });
  
  header.addEventListener('mouseleave', function() {
      // Fareyi modal-header alanı dışına çıktığında, isDragging'i false yap
      // Bu satırı kaldırabiliriz, çünkü artık tüm belgede mouseup olayını izliyoruz
  });
});