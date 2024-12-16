document.addEventListener('DOMContentLoaded', function() {
  const chatBox = document.querySelector(".chat-box");
  const messageInput = document.querySelector("#message-input");
  let sendBtn = document.getElementById('send-btn');
  const profileButton = document.querySelector(".profile");
  const dropdownContent = document.getElementById("dropdown-content");

  function styleCodeBlock(code, language) {
    // Function to apply styling to code blocks
    return `<pre><div class="bg-black rounded-md"><div class="flex items-center relative text-gray-200 bg-gray-800 dark:bg-token-surface-primary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>${language}</span><button class="flex gap-1 items-center copy-code-button">Copy code</button></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-${language}">${code}</code></div></div></pre>`;
  }

  function escapeHtml(content) {
    const htmlEscapeTable = {
      "&": "&amp;",
      '"': "&quot;",
      "'": "&apos;",
      ">": "&gt;",
      "<": "&lt;",
    };
    return content.replace(/[&"'<>]/g, char => htmlEscapeTable[char]);
  }

  sendBtn.addEventListener("click", sendMessage);
  messageInput.addEventListener('input', updateSendButton);
  
  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      addMessage(message, true);
      sendBtn.classList.remove("enabled");
      sendBtn.classList.add("sent");
      sendBtn.innerHTML = getSendButtonIcon("sent");
  
      fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      })
      .then(response => response.json())
      .then(data => {
        const answer = data.answer;
        addMessage(answer, false);
        sendBtn.classList.remove("sent");
        sendBtn.innerHTML = getSendButtonIcon("default");
      })
      .catch((error) => {
        console.error('Hata:', error);
        addMessage("Mesaj gönderilemedi.", false);
      });
  
      messageInput.value = "";
      messageInput.style.height = '24px';
    }
  }
  
  function updateSendButton() {
    const message = messageInput.value.trim();
    if (message) {
      sendBtn.classList.add("enabled");
    } else {
      sendBtn.classList.remove("enabled");
    }
  }

  function getSendButtonIcon(state) {
    if (state === "sent") {
      // Gönderildikten sonra gösterilecek yeni ikon
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
               class="h-2 w-2 text-gizmo-gray-950 dark:text-gray-200" height="16" width="16">
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"
                 stroke-width="0"></path>
              </svg>`;
    } else {
      // Varsayılan ikon (buton opaklığı düşükken veya aktif edildiğinde gösterilecek)
      return `<span class="send-icon" data-state="closed">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white">
                  <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2"
                       stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>`;
    }
  }

  profileButton.addEventListener("click", function(event) {
    const isDropdownOpen = dropdownContent.style.display === 'block';
    dropdownContent.style.display = isDropdownOpen ? 'none' : 'block';
    profileButton.classList.toggle('active', !isDropdownOpen);
    event.stopPropagation();
  });

  document.addEventListener("click", function(event) {
    const isProfileButton = event.target === profileButton || profileButton.contains(event.target);
    const isDropdownContent = dropdownContent.contains(event.target);
    const isDropdownOpen = dropdownContent.style.display === 'block';

    if (!isProfileButton && !isDropdownContent && isDropdownOpen) {
        dropdownContent.style.display = 'none';
        profileButton.classList.remove('active');
    }

    if (isDropdownContent) {
      dropdownContent.style.display = 'none';
      profileButton.classList.remove('active');
    }
  });

  function addMessage(message, isUser) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", isUser ? "user-message" : "bot-message");

    const headerDiv = document.createElement("div");
    headerDiv.classList.add(isUser ? "user-header" : "ai-header");
    if (isUser) {
      // Kullanıcı adı ve fotoğrafını ekleyin
      headerDiv.style.display = 'flex';
      headerDiv.style.alignItems = 'center';
      headerDiv.innerHTML = `<img src="https://raw.githubusercontent.com/oceandi/links/refs/heads/main/ISP/images/turkcell.png" alt="User profile" style="width:24px; height:24px; border-radius: 9999px;"><span style="font-weight:600; font-size:16px; margin-left: 10px; color: var(--text-color);">You</span>`;
    } else {
      // UnivacAI adı ve logosunu ekleyin
      const elipsDiv = document.createElement("div");
      elipsDiv.classList.add("elips");
      headerDiv.appendChild(elipsDiv);
      headerDiv.innerHTML += `<span style="font-weight:600; font-size:16px; color: var(--text-color);">UnivacAI</span>`;
    }

    const codeBlockRegex = /```([a-z]+)\n([\s\S]*?)```/gm;
    let match;
    let lastIndex = 0;
    let formattedMessage = '';

    while ((match = codeBlockRegex.exec(message)) !== null) {
      formattedMessage += escapeHtml(message.substring(lastIndex, match.index));
      const language = match[1];
      const code = match[2].trim();
      formattedMessage += styleCodeBlock(hljs.highlight(code, { language }).value, language);
      lastIndex = match.index + match[0].length;
    }

    formattedMessage += escapeHtml(message.substring(lastIndex));
    const messageContentDiv = document.createElement("div");
    messageContentDiv.classList.add("message-content");
    messageContentDiv.innerHTML = isUser ? `<p>${formattedMessage}</p>` : `<p>${formattedMessage}</p>`;
  
    msgDiv.appendChild(headerDiv);
    msgDiv.appendChild(messageContentDiv);
  
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  sendBtn.addEventListener("click", function() {
    const message = messageInput.value.trim();
    if (message) {
      addMessage(message, true);
      fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      })
      .then(response => response.json())
      .then(data => {
        addMessage(data.answer, false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      messageInput.value = "";
      messageInput.style.height = '24px';
      currentRow = 1;
    }
  });

  document.addEventListener('click', function(e) {
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");
    const settingsModal = document.getElementById("settingsModal");

    if (sidebar.style.width !== "0px" && e.target !== content && !content.contains(e.target) && !sidebar.contains(e.target) && !settingsModal.contains(e.target)) {
      sidebar.style.width = "0";
      content.style.marginLeft = "0";
      document.querySelector(".open-btn").classList.add("closed");
      hideTooltip();
    }
  });

  messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendBtn.click();
      e.preventDefault();
    }
  });

  messageInput.addEventListener('input', function() {
    this.style.height = '24px'; 
    const totalHeight = this.scrollHeight;
    this.value = capitalizeFirstLetter(this.value);
  
    const lineHeight = 24;
    const newLines = (this.value.match(/\n/g) || []).length;
    
    let overflowedContentHeight = totalHeight - lineHeight; 

    if(this.scrollHeight <= this.clientHeight){
      overflowedContentHeight = 0;
    }
  
    let newHeight = lineHeight + Math.max(newLines, overflowedContentHeight / lineHeight) * lineHeight;
    this.style.height = `${newHeight}px`;
    updateSendButton()
  });

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function copyToClipboard(code) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        console.log('Code copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Code copied to clipboard using fallback!');
    }
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(node => {
          if (node.classList && node.classList.contains('message')) {
            const copyButtons = node.querySelectorAll('.copy-code-button');
            copyButtons.forEach(btn => {
              btn.addEventListener('click', function(event) {
                const codeToCopy = btn.parentNode.nextElementSibling.querySelector('code').innerText;
                copyToClipboard(codeToCopy);

                const originalText = btn.innerText;
                btn.innerText = 'Copied!';

                setTimeout(function() {
                  btn.innerText = originalText; // Yarım saniye sonra butonun metnini orijinaline çevir
                }, 500);
              });
            });
          }
        });
      }
    });
  });

  observer.observe(chatBox, { childList: true });

  window.addEventListener('load', (event) => {
  messageInput.focus();
  });
});