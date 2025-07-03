// =============================================================================
// Seleção de Elementos do DOM
// =============================================================================
const startButton = document.getElementById('startButton'); // NOVO: Botão de início
const message1 = document.getElementById('message1');
const message2 = document.getElementById('message2');
const message3 = document.getElementById('message3');
const message4 = document.getElementById('message4');
const questionButton = document.getElementById('questionButton');
const calendarContainer = document.getElementById('calendar-container');
const invitationContainer = document.getElementById('invitation-container');
const selectedDayElement = document.getElementById('selected-day');

const acceptButton = document.getElementById('accept-button');
const rejectButton = document.getElementById('reject-button');

const finalMessageContainer = document.getElementById('final-message-container');
const finalText = document.getElementById('final-text');
const finalImage = document.getElementById('final-image');

// Seleção do elemento de áudio
const backgroundMusic = document.getElementById('backgroundMusic');

// =============================================================================
// Dados e Estados da Aplicação
// =============================================================================
const availableDates = [12, 13, 19, 20, 26, 27]; // Datas disponíveis para seleção em Julho de 2025
let selectedDate = null;
let rejectButtonState = -1; // Contador para o estado do botão "Recusar"


// =============================================================================
// Funções de Visibilidade e Manipulação de Elementos
// =============================================================================

/**
 * Inicializa a visibilidade dos elementos.
 * Adiciona a classe 'hidden' a todos os elementos que devem começar invisíveis.
 * O startButton começa visível, e a message1 começa oculta (já tem a classe hidden no HTML agora).
 */
function initializeVisibility() {
    console.log("Iniciando visibilidade dos elementos...");
    
    // Lista de todos os elementos que devem começar escondidos via classe 'hidden'.
    // Agora message1 também está nesta lista no HTML.
    const elementsToHide = [message1, message2, message3, message4, questionButton, 
                            calendarContainer, invitationContainer, finalMessageContainer];

    elementsToHide.forEach(element => {
        if (element) {
            element.classList.add('hidden'); 
            console.log(`${element.id || element.tagName} inicializado com classe 'hidden'.`);
        } else {
            console.warn(`AVISO: Elemento nulo encontrado na inicialização para esconder: ${element}.`);
        }
    });

    // O startButton começa visível por padrão, então não adicionamos 'hidden' a ele aqui.
    if (startButton) {
        startButton.style.opacity = '1'; // Garante que esteja visível
        startButton.style.pointerEvents = 'auto';
        console.log("startButton configurado para ser visível.");
    }
}


/**
 * Mostra um elemento, removendo a classe 'hidden' para ativar transições CSS.
 * @param {HTMLElement} element O elemento HTML a ser mostrado.
 */
function showElement(element) { 
    if (!element) {
        console.error("Tentativa de mostrar elemento nulo!");
        return;
    }
    console.log(`Tentando mostrar ${element.id || element.tagName}`);
    
    // Remove a classe 'hidden' para que o elemento apareça (display: flex/block e opacity: 1)
    element.classList.remove('hidden'); 
    // Garante que a transição de opacidade aconteça
    element.style.opacity = '1'; 
    element.style.pointerEvents = 'auto'; // Reativa interações

    console.log(`${element.id || element.tagName} agora: classes=${element.className}, opacity=${element.style.opacity}`);
}

/**
 * Esconde um elemento com uma transição suave, adicionando a classe 'hidden'.
 * A transição de opacidade é gerenciada pelo CSS e o `display: none` é aplicado
 * somente após a transição para garantir suavidade.
 * @param {HTMLElement} element O elemento HTML a ser escondido.
 * @param {Function} [callback=null] Uma função a ser chamada após o elemento estar completamente escondido.
 */
function hideElement(element, callback = null) {
    if (!element) {
        console.error("Tentativa de esconder elemento nulo!");
        if (callback) callback(); 
        return;
    }
    console.log(`Tentando esconder ${element.id || element.tagName}`);
    
    element.style.opacity = '0'; // Inicia a transição de opacidade para invisível
    element.style.pointerEvents = 'none'; // Desativa interações imediatamente

    const onTransitionEnd = () => {
        element.classList.add('hidden'); // Adiciona a classe 'hidden' para remover do fluxo
        element.removeEventListener('transitionend', onTransitionEnd); // Remove o listener
        console.log(`${element.id || element.tagName} escondido: classes=${element.className}, opacity=${element.style.opacity}`);
        if (callback) callback(); // Executa o callback
    };

    // Adiciona o listener para a transição de opacidade.
    // Se o elemento não tiver transição ou já estiver invisível, esconde imediatamente.
    const computedStyle = window.getComputedStyle(element);
    const transitionDuration = parseFloat(computedStyle.transitionDuration);

    if (element.style.opacity !== '0' && transitionDuration > 0) {
        element.addEventListener('transitionend', onTransitionEnd);
    } else {
        // Se já está invisível ou sem transição, esconde imediatamente
        setTimeout(() => {
            element.classList.add('hidden');
            if (callback) callback();
        }, 50); // Pequeno atraso para evitar race conditions
    }
}


// =============================================================================
// Lógica Principal da Aplicação e Sequência de Eventos
// =============================================================================

// Chama a função de inicialização assim que o script é carregado
initializeVisibility();

/**
 * Inicia a reprodução da música de fundo.
 * Esta função agora é chamada exclusivamente pelo clique do startButton.
 */
function startMusic() {
    if (backgroundMusic) {
        backgroundMusic.volume = 0.5; // Ajuste o volume se desejar (0.0 a 1.0)
        const playPromise = backgroundMusic.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Música iniciada com sucesso pelo startButton.");
            }).catch(error => {
                console.error("Erro ao iniciar a música:", error);
            });
        }
    }
}

/**
 * Inicia a sequência de mensagens após a música começar.
 */
function startMessageSequence() {
    console.log("Iniciando sequência de mensagens...");
    setTimeout(() => {
        showElement(message1); 
        message1.style.transform = 'translate(-50%, -50%) scale(1.5)';
    }, 500); // Pequeno atraso para a música começar primeiro

    setTimeout(() => {
        hideElement(message1, () => {
            setTimeout(() => {
                showElement(message2);
                for (let i = 0; i < 20; i++) createHeart();
            }, 1000);
        });
    }, 3000);

    setTimeout(() => {
        hideElement(message2, () => {
            setTimeout(() => {
                showElement(message3);
                message3.style.transform = 'translate(-50%, -50%) scale(1.5)';
            }, 1000);
        });
    }, 7000);

    setTimeout(() => {
        hideElement(message3, () => {
            setTimeout(() => {
                showElement(message4);
                setTimeout(() => {
                    showElement(questionButton); 
                    questionButton.style.transform = 'translateX(-50%) scale(1)'; 
                    questionButton.addEventListener('click', handleQuestionButtonClick, { once: true }); 
                    console.log("Botão da pergunta deve estar visível e clicável agora.");
                }, 1000);
            }, 1000);
        });
    }, 11000);
}


// Adiciona o listener para o botão de início
if (startButton) {
    startButton.addEventListener('click', () => {
        hideElement(startButton, () => { // Esconde o botão de início
            startMusic(); // Inicia a música
            startMessageSequence(); // Inicia a sequência de mensagens
        });
    }, { once: true }); // Garante que o evento seja disparado apenas uma vez
}


/**
 * Handler para o clique do botão de pergunta. Esconde as mensagens e inicia o calendário.
 */
function handleQuestionButtonClick() {
    console.log("Botão da pergunta clicado! Escondendo mensagem 4 e botão.");
    
    hideElement(message4, () => {
        hideElement(questionButton, () => {
            console.log("Mensagem 4 e botão da pergunta escondidos. Chamando showCalendar().");
            showCalendar(); 
        });
    });
}

/**
 * Gera dinamicamente o calendário e o exibe para a seleção de datas.
 */
function showCalendar() {
    console.log("Entrando na função showCalendar().");
    if (!calendarContainer) {
        console.error("ERRO: calendarContainer não foi encontrado no DOM ao chamar showCalendar()!");
        return; 
    }

    // Limpa o conteúdo anterior do contêiner do calendário para garantir uma injeção limpa.
    calendarContainer.innerHTML = ''; 

    // Calcula o dia da semana do 1º de Julho de 2025. (0=Domingo, 6=Sábado)
    const firstDayOfWeekOfFirstDayOfMonth = new Date(2025, 6, 1).getDay(); 
    console.log("Dia da semana do dia 1º de Julho de 2025:", firstDayOfWeekOfFirstDayOfMonth);
    const daysInMonth = 31; // Julho sempre tem 31 dias.

    const calendarHtml = `
        <h2 style="text-align: center;">Escolha uma data</h2>
        <div class="calendar">
            <div class="weekdays">
                <div>Dom</div><div>Seg</div><div>Ter</div>
                <div>Qua</div><div>Qui</div><div>Sex</div>
                <div>Sáb</div>
            </div>
            <div class="days" id="calendar-days"></div>
        </div>
        <button id="confirm-date-btn">Confirmar Data</button>
    `;
    
    calendarContainer.innerHTML = calendarHtml; 
    console.log("HTML do calendário injetado em calendarContainer.");
    
    const daysGrid = document.getElementById('calendar-days');
    if (!daysGrid) {
        console.error("ERRO: O elemento #calendar-days não foi encontrado APÓS a injeção do HTML. Verifique o HTML gerado.");
        return; 
    }

    let daysHtml = '';

    // Preenche os dias vazios no início do mês para alinhar com o dia da semana correto.
    for (let i = 0; i < firstDayOfWeekOfFirstDayOfMonth; i++) {
        daysHtml += '<div class="empty"></div>';
    }

    // Gera os dias do mês, aplicando as classes 'available' ou 'unavailable'.
    for (let day = 1; day <= daysInMonth; day++) {
        if (availableDates.includes(day)) {
            daysHtml += `<div class="available" data-day="${day}">${day}</div>`;
        } else {
            daysHtml += `<div class="unavailable">${day}</div>`;
        }
    }

    daysGrid.innerHTML = daysHtml; 
    console.log("Dias do calendário injetados em #calendar-days.");

    // Mostra o contêiner do calendário.
    showElement(calendarContainer); 
    console.log("Chamado showElement para calendarContainer.");
    
    // Adiciona event listeners para os dias disponíveis do calendário.
    const availableDaysElements = document.querySelectorAll('.available');
    availableDaysElements.forEach(dayElement => {
        dayElement.addEventListener('click', function () {
            // Remove a classe 'selected' de qualquer dia previamente selecionado.
            document.querySelectorAll('.available').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected'); // Adiciona a classe 'selected' ao dia clicado.
            selectedDate = this.getAttribute('data-day');
            console.log('Dia Selecionado:', selectedDate);
        });
    });

    // Adiciona event listener para o botão de confirmar data.
    document.getElementById('confirm-date-btn').addEventListener('click', () => {
        if (selectedDate) {
            hideElement(calendarContainer, () => {
                const formattedDay = selectedDate < 10 ? `0${selectedDate}` : selectedDate;
                selectedDayElement.textContent = `${formattedDay} de Julho`;
                showElement(invitationContainer); 
                
                // Reinicia o estado e os estilos do botão "Recusar" para a próxima interação.
                rejectButton.style.transform = 'translateX(calc(-50% + 60px))';
                rejectButton.classList.remove('fading-away');
                // Garante que o botão recusar esteja visível quando o convite aparece.
                rejectButton.style.opacity = '1'; 
                rejectButton.style.pointerEvents = 'auto';
                rejectButtonState = -1;

                // Remove e adiciona os event listeners dos botões de convite para evitar duplicação.
                acceptButton.removeEventListener("click", acceptInvitation);
                // removeEventListener do rejectButton também é importante aqui para evitar múltiplos listeners
                rejectButton.removeEventListener("mouseenter", moveRejectButton); 

                acceptButton.addEventListener("click", acceptInvitation);
                rejectButton.addEventListener("mouseenter", moveRejectButton);

                for (let i = 0; i < 30; i++) {
                    setTimeout(() => createHeart(), i * 100);
                }
            });
        } else {
            alert('Por favor, selecione uma data disponível.');
        }
    });
}

/**
 * Move o botão "Recusar" para uma posição aleatória quando o mouse entra nele.
 */
function moveRejectButton(){
    rejectButtonState++; // Incrementa o contador de "tentativas de recusar"

    // Calcula os limites dentro do contêiner dos botões para o movimento do botão "Recusar".
    const containerButtons = invitationContainer.querySelector('.invitation-buttons');
    const containerWidth = containerButtons.offsetWidth;
    const containerHeight = containerButtons.offsetHeight;

    const buttonWidth = rejectButton.offsetWidth;
    const buttonHeight = rejectButton.offsetHeight;

    const padding = 20; // Margem interna para o botão não colar nas bordas
    const minX = -containerWidth / 2 + buttonWidth / 2 + padding;
    const maxX = containerWidth / 2 - buttonWidth / 2 - padding;
    const minY = -containerHeight / 2 + buttonHeight / 2 + padding;
    const maxY = containerHeight / 2 - buttonHeight / 2 - padding;

    // Gera novas coordenadas aleatórias dentro dos limites definidos.
    const newX = Math.random() * (maxX - minX) + minX;
    const newY = Math.random() * (maxY - minY) + minY;

    rejectButton.style.transform = `translate(${newX}px, ${newY}px)`; // Aplica a nova posição

    // Se o usuário tentou "recusar" 3 ou mais vezes, o botão some, mas o convite NÃO é aceito automaticamente.
    if (rejectButtonState >= 3) {
        rejectButton.classList.add('fading-away'); // Inicia a animação de sumir
        rejectButton.style.pointerEvents = 'none'; // Desabilita novos cliques/interações
    }
}

/**
 * Lida com a aceitação do convite, escondendo o contêiner de convite
 * e exibindo a mensagem final com corações.
 */
function acceptInvitation(){
    rejectButton.removeEventListener("mouseenter", moveRejectButton); // Garante que o botão "Recusar" não reaja mais

    hideElement(invitationContainer, () => {
        finalText.textContent = "Sabia que ia fazer a melhor escolha, me chama no zap!";
        finalImage.src = "./assets/flerte-icon.png"; 

        showElement(finalMessageContainer);
        for (let i = 0; i < 50; i++) {
            setTimeout(() => createHeart(), i * 50); // Cria vários corações para a mensagem final
        }
    });
}

/**
 * Cria um elemento de coração flutuante e o adiciona ao corpo do documento.
 * O coração tem uma animação de flutuação e é removido após um tempo.
 */
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    // Define posição inicial aleatória e duração/atraso da animação.
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 3 + 's'; // Duração entre 3 e 6 segundos
    heart.style.animationDelay = Math.random() * 2 + 's'; // Atraso de até 2 segundos
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 5000); // Remove o coração do DOM após 5 segundos
}