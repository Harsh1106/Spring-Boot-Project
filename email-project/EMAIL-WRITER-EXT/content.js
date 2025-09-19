console.log("Email Writer");

function getEmailContent(){
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for(const selector of selectors){
        const content = document.querySelector(selector);
        if(content){
            return content.innerText.trim();
        }
    }
    return '';
}

function findComposeToolbar(){
    const selectors = [
        '.bTc', '.aDh', '[role="toolbar"]', '.gU.Up'  // Gmail compose toolbars
    ];

    for(const selector of selectors){
        const toolbar = document.querySelector(selector);
        if(toolbar){
            return toolbar;
        }
    }

    return null;
}

function createAIButton(){
    const button = document.createElement('button');
    button.className = 'T-I J-J5-Ji aoO T-I-atl L3 ai-reply-button';
    button.style.margin = '0';
    button.style.padding = '0 12px';
    button.style.height = '36px';
    button.style.backgroundColor = '#1a73e8';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.fontSize = '14px';
    button.style.cursor = 'pointer';
    button.innerText = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function injectButton(){
    const existingButton = document.querySelector('.ai-reply-button');
    if(existingButton)
        existingButton.remove();

    const toolbar = findComposeToolbar();
    if(!toolbar){
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found");
    const button = createAIButton();
    
    button.addEventListener('click', async () => {
        try {
            button.innerText = 'Generating...';
            button.disabled = true;

            const emailContent = getEmailContent();
            const response = await fetch('https://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    emailContent: emailContent, 
                    tone: 'professional'
                })
            });

            if(!response.ok){
                throw new Error('API Request Failed');
            }

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if(composeBox){
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            }

        } catch(err) {
            console.error('Error generating AI reply:', err);
        } finally {
            button.innerText = 'AI Reply';
            button.disabled = false;
        }
    });

    const sendButton = toolbar.querySelector('div[role="button"][data-tooltip^="Send"]');
    
    if (sendButton) {
        // Create wrapper to stack AI button above Send button
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'flex-start';
        wrapper.style.marginBottom = '8px';

        wrapper.appendChild(button);
        wrapper.appendChild(sendButton);

        toolbar.insertBefore(wrapper, sendButton);
    } else {
        toolbar.insertBefore(button, toolbar.firstChild);
    }
}

const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.aDh, .bTc, [role="dialog"]') 
            || node.querySelector('.aDh, .bTc, [role="dialog"]'))
        );

        if(hasComposeElements){
            console.log("Compose window detected");
            setTimeout(injectButton, 500);            
        }
    }
});

observer.observe(document.body, {
    childList: true, 
    subtree: true 
});
