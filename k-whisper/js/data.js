/* ============================================
   K-WHISPER — Modelo de Dados & JSON Schema
   ============================================

   SCHEMA DE REFERENCIA
   --------------------

   Avatar {
     avatar_id    : string      — ID unico do avatar
     name         : string      — Nome de exibicao
     subtitle     : string      — Descricao curta do personagem
     avatar_img   : string      — Foto de perfil (personagem1.png)
     bg_img       : string      — Imagem de fundo do chat (personagem2.png)
     status       : string      — "Online" | texto livre
     tags         : string[]    — Tracos de personalidade
   }

   StoryNode {
     node_id             : string      — ID unico do no
     avatar_id           : string      — Quem envia a mensagem
     message_text        : string      — Texto (suporta HTML, *acoes entre asteriscos*)
     typing_delay_ms     : number      — Delay do indicador "Digitando..." (ms)
     choices             : Choice[]    — 1 a 3 opcoes (inclusive no no de paywall)
     is_paywall_trigger  : boolean     — true = Zeigarnik: permite clique, depois trava
     meta : {
       interaction_index : number      — Posicao sequencial na arvore
       chapter           : string      — ID do capitulo
     }
   }

   Choice {
     id              : string  — ID unico da escolha
     label           : string  — Texto exibido no botao
     tone            : string  — "submissa" | "provocativa" | "fria"
     next_node_id    : string  — ID do proximo no na arvore
     affinity_impact : number  — Impacto na barra de afinidade (+2, +1, 0, -1)
   }

   PushNotification {
     trigger_time_s : number  — Segundos apos inicio do video para disparar
     avatar_id      : string  — Avatar que "envia" a notificacao
     preview_text   : string  — Texto de preview
     entry_node_id  : string  — No inicial ao clicar na notificacao
     story_id       : string  — ID da historia/rota
   }

   PaywallConfig {
     max_free_interactions : number  — Limite de interacoes gratis (default 30)
     max_affinity          : number  — Valor maximo da barra de afinidade (default 30)
     headline              : string  — Titulo do paywall (Zeigarnik)
     subtext               : string  — Subtexto
     price                 : string  — Preco formatado (ex: "R$ 9,90")
     cta_text              : string  — Texto do botao CTA
     checkout_url          : string  — URL de redirecionamento
   }

   ============================================ */

/* ---------- Avatares ---------- */

var KW_AVATARS = {
    'kang-taejun': {
        avatar_id: 'kang-taejun',
        name: 'Kang Tae-jun',
        subtitle: 'CEO frio e implacavel. Usa o poder nos negocios para disfarcar a obsessao por voce.',
        avatar_img: 'k-whisper/img/avatars/kang-taejun1.png',
        bg_img: 'k-whisper/img/avatars/kang-taejun2.png',
        status: 'Online',
        tags: ['frio', 'formal', 'possessivo']
    }
    /* Desativados por enquanto:
    ,'ryu-jinwoo': {
        avatar_id: 'ryu-jinwoo',
        name: 'Ryu Jin-woo',
        subtitle: 'Guarda-costas letal e calado. Seu instinto assassino se curva apenas para te proteger.',
        avatar_img: 'k-whisper/img/avatars/ryu-jinwoo1.png',
        bg_img: 'k-whisper/img/avatars/ryu-jinwoo2.png',
        status: 'Online',
        tags: ['monossilabico', 'protetor', 'intenso']
    },
    'han-doyun': {
        avatar_id: 'han-doyun',
        name: 'Han Do-yun',
        subtitle: 'Amigo de infancia carinhoso. E o seu porto seguro, mas esconde um desejo real por voce.',
        avatar_img: 'k-whisper/img/avatars/han-doyun1.png',
        bg_img: 'k-whisper/img/avatars/han-doyun2.png',
        status: 'Online',
        tags: ['carinhoso', 'leal', 'gentil']
    }
    */
};

/* ---------- Paywall Config ---------- */

var KW_PAYWALL_CONFIG = {
    max_free_interactions: 30,
    max_affinity: 30,
    headline: 'Voce fez a sua escolha.',
    subtext: 'Para ver a reacao dele, desbloqueie a cena completa agora.',
    price: 'R$ 9,90',
    cta_text: 'Desbloquear Cena Completa',
    checkout_url: 'https://pay.lowify.com.br/checkout?product_id=bZRnAm'
};

/* ---------- Story: Kang Tae-jun — O CEO (30 nos) ---------- */

var KW_DEMO_STORY = {
    story_id: 'demo-kang-taejun-01',
    avatar_id: 'kang-taejun',
    nodes: {

        /* ===== CAPITULO 1 — Conversa noturna (nos 01-10) ===== */

        'node_001': {
            node_id: 'node_001',
            avatar_id: 'kang-taejun',
            message_text: 'Sao 23h40. O painel do sistema me mostra que voce ainda esta logada no servidor da empresa. Desligue isso agora. Eu nao pago hora extra para voce brincar de martir do escritorio.',
            typing_delay_ms: 2500,
            choices: [
                { id: 'c01a', label: 'Me desculpe, Sr. Kang. Eu so queria terminar o relatorio para nao atrasar o seu cronograma amanha.', tone: 'submissa', next_node_id: 'node_002a', affinity_impact: 1 },
                { id: 'c01b', label: 'Vigiando meus horarios de login a essa hora da noite? Nao tem nada melhor para fazer, Sr. Kang?', tone: 'provocativa', next_node_id: 'node_002b', affinity_impact: 1 },
                { id: 'c01c', label: 'O trabalho exigia conclusao. Estou desligando agora. Boa noite.', tone: 'fria', next_node_id: 'node_002c', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 1, chapter: 'cap_01' }
        },
        'node_002a': {
            node_id: 'node_002a',
            avatar_id: 'kang-taejun',
            message_text: 'Meu cronograma nao precisa da sua privacao de sono para funcionar. Va dormir. E se voce aparecer amanha no escritorio com olheiras, vou mandar voce de volta para casa no meu carro particular.',
            typing_delay_ms: 2500,
            choices: [
                { id: 'c02a', label: '...', tone: 'submissa', next_node_id: 'node_003', affinity_impact: 0 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 2, chapter: 'cap_01' }
        },
        'node_002b': {
            node_id: 'node_002b',
            avatar_id: 'kang-taejun',
            message_text: 'Cuidado com o tom que voce usa comigo fora do horario comercial. Posso ser seu chefe, mas nao sou paciente. E sim, e meu trabalho saber exatamente o que voce esta fazendo.',
            typing_delay_ms: 2200,
            choices: [
                { id: 'c02b', label: '...', tone: 'submissa', next_node_id: 'node_003', affinity_impact: 0 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 2, chapter: 'cap_01' }
        },
        'node_002c': {
            node_id: 'node_002c',
            avatar_id: 'kang-taejun',
            message_text: 'Fria como sempre. Sabe o que e irritante? O fato de que voce acha que pode simplesmente me dar "boa noite" e sumir depois de me deixar esperando uma resposta o dia todo.',
            typing_delay_ms: 2500,
            choices: [
                { id: 'c02c', label: '...', tone: 'submissa', next_node_id: 'node_003', affinity_impact: 0 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 2, chapter: 'cap_01' }
        },
        'node_003': {
            node_id: 'node_003',
            avatar_id: 'kang-taejun',
            message_text: 'Eu nao pago voce para ser uma maquina sem vida. Amanha de manha, cancele a sua primeira reuniao. Voce vai tomar cafe da manha na minha sala. E nao se atrase um minuto.',
            typing_delay_ms: 2500,
            choices: [
                { id: 'c03a', label: 'Sim, Sr. Kang. Eu estarei la no horario.', tone: 'submissa', next_node_id: 'node_004', affinity_impact: 1 },
                { id: 'c03b', label: 'Cafe da manha na sua sala? Isso nao faz parte do meu contrato.', tone: 'provocativa', next_node_id: 'node_004', affinity_impact: 1 },
                { id: 'c03c', label: 'Minha agenda esta cheia amanha. Posso mandar os relatorios por e-mail.', tone: 'fria', next_node_id: 'node_004', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 3, chapter: 'cap_01' }
        },
        'node_004': {
            node_id: 'node_004',
            avatar_id: 'kang-taejun',
            message_text: 'Nao me importo com a sua agenda. Eu dito a sua agenda. Se voce nao aparecer, eu mesmo desco ate a sua mesa e te arrasto para cima. Escolha.',
            typing_delay_ms: 2200,
            choices: [
                { id: 'c04a', label: 'Nao precisa fazer isso... Eu vou subir. Me desculpe se o irritei.', tone: 'submissa', next_node_id: 'node_005', affinity_impact: 1 },
                { id: 'c04b', label: 'Quero ver voce tentar, Chefe.', tone: 'provocativa', next_node_id: 'node_005', affinity_impact: 1 },
                { id: 'c04c', label: 'Isso e assedio moral, Kang Tae-jun.', tone: 'fria', next_node_id: 'node_005', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 4, chapter: 'cap_01' }
        },
        'node_005': {
            node_id: 'node_005',
            avatar_id: 'kang-taejun',
            message_text: 'Voce testando os meus limites e exatamente o motivo pelo qual eu nao consigo parar de olhar para a camera de seguranca do seu andar.',
            typing_delay_ms: 2200,
            choices: [
                { id: 'c05a', label: 'Voce... voce fica me olhando pelas cameras?', tone: 'submissa', next_node_id: 'node_006', affinity_impact: 1 },
                { id: 'c05b', label: 'Gostou do que viu hoje quando eu estava de saia?', tone: 'provocativa', next_node_id: 'node_006', affinity_impact: 1 },
                { id: 'c05c', label: 'Voce e doente. Vou pedir as contas.', tone: 'fria', next_node_id: 'node_006', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 5, chapter: 'cap_01' }
        },
        'node_006': {
            node_id: 'node_006',
            avatar_id: 'kang-taejun',
            message_text: 'Nao finja que esta ofendida. Eu vi como voce arrumou o cabelo antes de entrar na minha sala de reunioes hoje. Eu sei o efeito que eu tenho sobre voce. O mesmo que voce tem sobre mim.',
            typing_delay_ms: 2500,
            choices: [
                { id: 'c06a', label: 'Eu... eu nao sei o que dizer.', tone: 'submissa', next_node_id: 'node_007', affinity_impact: 1 },
                { id: 'c06b', label: 'Entao admita. Voce esta obcecado, nao e?', tone: 'provocativa', next_node_id: 'node_007', affinity_impact: 1 },
                { id: 'c06c', label: 'Voce esta vendo coisas onde nao existem, chefe.', tone: 'fria', next_node_id: 'node_007', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 6, chapter: 'cap_01' }
        },
        'node_007': {
            node_id: 'node_007',
            avatar_id: 'kang-taejun',
            message_text: 'Estou? Entao por que a sua respiracao acelera toda vez que eu chego perto da sua mesa? Por que voce fica vermelha quando eu leio a tela por cima do seu ombro?',
            typing_delay_ms: 2200,
            choices: [
                { id: 'c07a', label: 'Voce me deixa nervosa... E diferente.', tone: 'submissa', next_node_id: 'node_008', affinity_impact: 1 },
                { id: 'c07b', label: 'Talvez eu goste quando voce fica tao perto. Ja pensou nisso?', tone: 'provocativa', next_node_id: 'node_008', affinity_impact: 1 },
                { id: 'c07c', label: 'Porque voce nao tem nocao de espaco pessoal e me sufoca.', tone: 'fria', next_node_id: 'node_008', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 7, chapter: 'cap_01' }
        },
        'node_008': {
            node_id: 'node_008',
            avatar_id: 'kang-taejun',
            message_text: 'Eu conheco os seus limites melhor do que voce. E eu tambem sei o que voce faz quando acha que ninguem esta olhando na sala de arquivos do subsolo.',
            typing_delay_ms: 2200,
            choices: [
                { id: 'c08a', label: 'Voce... estava la?', tone: 'submissa', next_node_id: 'node_009', affinity_impact: 1 },
                { id: 'c08b', label: 'O que eu faco, Tae-jun? Me conte.', tone: 'provocativa', next_node_id: 'node_009', affinity_impact: 1 },
                { id: 'c08c', label: 'Pare de inventar historias. Voce esta blefando.', tone: 'fria', next_node_id: 'node_009', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 8, chapter: 'cap_01' }
        },
        'node_009': {
            node_id: 'node_009',
            avatar_id: 'kang-taejun',
            message_text: 'Eu estava a cinco passos de voce na penumbra. Sentindo o cheiro do seu perfume. Eu vi voce lendo aquele livro no celular. Aquele romance sujo. Quem voce estava imaginando enquanto mordia os labios? Era eu?',
            typing_delay_ms: 3000,
            choices: [
                { id: 'c09a', label: 'Por favor, para. Alguem da TI pode ler essas mensagens no servidor.', tone: 'submissa', next_node_id: 'node_010', affinity_impact: 1 },
                { id: 'c09b', label: 'E se fosse? O que voce vai fazer sobre isso a essa hora da noite?', tone: 'provocativa', next_node_id: 'node_010', affinity_impact: 1 },
                { id: 'c09c', label: 'Isso e invasivo e completamente antietico.', tone: 'fria', next_node_id: 'node_010', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 9, chapter: 'cap_01' }
        },
        'node_010': {
            node_id: 'node_010',
            avatar_id: 'kang-taejun',
            message_text: 'Alguem ler isso e o menor dos seus problemas agora. Voce vai descobrir exatamente o que eu vou fazer sobre isso amanha de manha. Quando eu trancar a porta da minha sala.',
            typing_delay_ms: 2500,
            choices: [
                { id: 'c10', label: '...', tone: 'submissa', next_node_id: 'node_011', affinity_impact: 0 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 10, chapter: 'cap_01' }
        },

        /* ===== CAPITULO 2 — Escritorio, porta trancada (nos 11-20) ===== */

        'node_011': {
            node_id: 'node_011',
            avatar_id: 'kang-taejun',
            message_text: '*A porta faz um clique metalico pesado quando ele gira a chave por dentro.* Voce realmente veio. E exatamente no horario. Sente-se.',
            typing_delay_ms: 2500,
            choices: [
                { id: 'c11a', label: 'Voce mandou eu vir... Por que voce trancou a porta, Sr. Kang?', tone: 'submissa', next_node_id: 'node_012', affinity_impact: 1 },
                { id: 'c11b', label: 'Trancando a porta para a sua secretaria? O RH adoraria saber disso.', tone: 'provocativa', next_node_id: 'node_012', affinity_impact: 1 },
                { id: 'c11c', label: 'Por favor, destranque a porta. Eu tenho planilhas para entregar.', tone: 'fria', next_node_id: 'node_012', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 11, chapter: 'cap_02' }
        },
        'node_012': {
            node_id: 'node_012',
            avatar_id: 'kang-taejun',
            message_text: '*Ele ignora o que voce disse, da a volta na mesa de mogno e para exatamente na sua frente. O cheiro do perfume caro dele invade o espaco.* Eu nao te chamei aqui para falar de planilhas. Olhe para cima. Olhe para mim.',
            typing_delay_ms: 3000,
            choices: [
                { id: 'c12a', label: '*Eu levanto o olhar devagar, sentindo meu coracao acelerar.*', tone: 'submissa', next_node_id: 'node_013', affinity_impact: 1 },
                { id: 'c12b', label: 'E se eu nao quiser olhar? Vai me obrigar?', tone: 'provocativa', next_node_id: 'node_013', affinity_impact: 1 },
                { id: 'c12c', label: 'Estou olhando. O que voce quer?', tone: 'fria', next_node_id: 'node_013', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 12, chapter: 'cap_02' }
        },
        'node_013': {
            node_id: 'node_013',
            avatar_id: 'kang-taejun',
            message_text: '*Ele se abaixa levemente e levanta o seu queixo com dois dedos frios e firmes, forcando contato visual.* Voce esta com olheiras. Ficou acordada a noite toda pensando no que eu disse? Ou estava ocupada com outra coisa?',
            typing_delay_ms: 3000,
            choices: [
                { id: 'c13a', label: 'Eu... eu nao consegui dormir. Fiquei nervosa.', tone: 'submissa', next_node_id: 'node_014', affinity_impact: 1 },
                { id: 'c13b', label: 'Talvez eu estivesse ocupada com alguem mais interessante.', tone: 'provocativa', next_node_id: 'node_014', affinity_impact: 1 },
                { id: 'c13c', label: 'Foi so insonia. Nao tem nada a ver com voce.', tone: 'fria', next_node_id: 'node_014', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 13, chapter: 'cap_02' }
        },
        'node_014': {
            node_id: 'node_014',
            avatar_id: 'kang-taejun',
            message_text: '*Os olhos dele escurecem instantaneamente e o aperto no seu queixo fica um pouco mais possessivo.* Nao me teste. Se eu descobrir que outro homem esta ocupando o seu tempo livre, eu garanto que ele sera transferido para a nossa filial na Siberia ate o fim do dia. Voce pertence a este escritorio. A mim.',
            typing_delay_ms: 3500,
            choices: [
                { id: 'c14a', label: 'Voce... nao pode fazer isso. Nao tem mais ninguem, eu juro.', tone: 'submissa', next_node_id: 'node_015', affinity_impact: 1 },
                { id: 'c14b', label: 'O grande CEO Kang Tae-jun esta com ciumes de um fantasma?', tone: 'provocativa', next_node_id: 'node_015', affinity_impact: 1 },
                { id: 'c14c', label: 'Eu sou uma funcionaria, nao sua propriedade.', tone: 'fria', next_node_id: 'node_015', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 14, chapter: 'cap_02' }
        },
        'node_015': {
            node_id: 'node_015',
            avatar_id: 'kang-taejun',
            message_text: '*Ele solta o seu queixo, mas apoia as duas maos nos bracos da sua cadeira, prendendo voce completamente contra ele. Ele se inclina, os labios a centimetros do seu ouvido.* Eu posso fazer o que eu quiser. E a partir de hoje, voce vai cancelar o seu horario de almoco tambem. Porque voce vai ficar exatamente onde eu possa te ver.',
            typing_delay_ms: 3500,
            choices: [
                { id: 'c15a', label: 'Sim, Sr. Kang...', tone: 'submissa', next_node_id: 'node_016', affinity_impact: 1 },
                { id: 'c15b', label: 'E o que vamos fazer no almoco... de portas trancadas?', tone: 'provocativa', next_node_id: 'node_016', affinity_impact: 1 },
                { id: 'c15c', label: 'Isso e contra as leis trabalhistas. Me deixe levantar.', tone: 'fria', next_node_id: 'node_016', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 15, chapter: 'cap_02' }
        },
        'node_016': {
            node_id: 'node_016',
            avatar_id: 'kang-taejun',
            message_text: '*Um sorriso sombrio e quase imperceptivel curva o canto dos labios dele enquanto o polegar quente roca de forma "acidental" no seu labio inferior.* Leis nao se aplicam a portas trancadas. E sobre o que vamos fazer... isso depende inteiramente do seu nivel de obediencia.',
            typing_delay_ms: 3200,
            choices: [
                { id: 'c16a', label: '*Eu prendo a respiracao e concordo devagar, sem quebrar o contato visual.*', tone: 'submissa', next_node_id: 'node_017', affinity_impact: 1 },
                { id: 'c16b', label: 'E se eu decidir ser uma pessima funcionaria hoje, Sr. Kang?', tone: 'provocativa', next_node_id: 'node_017', affinity_impact: 1 },
                { id: 'c16c', label: 'Tire a mao de mim. Voce esta cruzando uma linha.', tone: 'fria', next_node_id: 'node_017', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 16, chapter: 'cap_02' }
        },
        'node_017': {
            node_id: 'node_017',
            avatar_id: 'kang-taejun',
            message_text: '*De repente, batidas secas na porta quebram o silencio. Uma voz masculina (o estagiario do marketing) chama o seu nome do corredor.* Ele de novo. Aquele idiota nao sabe que voce esta ocupada? Fale para ele ir embora. Agora.',
            typing_delay_ms: 3000,
            choices: [
                { id: 'c17a', label: 'E-eu... estou ocupada! Volte mais tarde! *Grito, com a voz tremula.*', tone: 'submissa', next_node_id: 'node_018', affinity_impact: 1 },
                { id: 'c17b', label: '*Fico em silencio de proposito, so para ver a reacao de Tae-jun.*', tone: 'provocativa', next_node_id: 'node_018', affinity_impact: 1 },
                { id: 'c17c', label: 'Estou aqui dentro com o chefe! Ja abro!', tone: 'fria', next_node_id: 'node_018', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 17, chapter: 'cap_02' }
        },
        'node_018': {
            node_id: 'node_018',
            avatar_id: 'kang-taejun',
            message_text: '*Antes que mais alguma palavra seja dita, ele cobre a sua boca com a mao, silenciando voce. O corpo dele pressiona contra o seu. O olhar dele e puro instinto e ciume irracional.* Pensando bem... shhh. Deixe ele bater. Deixe ele ficar no corredor imaginando o que exatamente o CEO esta fazendo com voce aqui dentro.',
            typing_delay_ms: 3500,
            choices: [
                { id: 'c18a', label: '*Fecho os olhos, rendida a forca dele contra mim, sentindo meu corpo queimar.*', tone: 'submissa', next_node_id: 'node_019', affinity_impact: 1 },
                { id: 'c18b', label: '*Dou uma leve mordida na mao dele que cobre minha boca, provocando-o.*', tone: 'provocativa', next_node_id: 'node_019', affinity_impact: 1 },
                { id: 'c18c', label: '*Tento me debater e empurrar o peito dele, mas ele nao se move um milimetro.*', tone: 'fria', next_node_id: 'node_019', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 18, chapter: 'cap_02' }
        },
        'node_019': {
            node_id: 'node_019',
            avatar_id: 'kang-taejun',
            message_text: '*Ele ouve os passos do estagiario se afastando da porta. Lentamente, ele tira a mao da sua boca e desliza os dedos pelo seu pescoco, sentindo a sua pulsacao disparada.* Seu coracao esta batendo tao rapido... Voce esta apavorada, ou esta gostando do fato de que ele nao pode te ter, mas eu posso?',
            typing_delay_ms: 3500,
            choices: [
                { id: 'c19a', label: 'Estou gostando... de estar com voce.', tone: 'submissa', next_node_id: 'node_020', affinity_impact: 1 },
                { id: 'c19b', label: 'Prova que voce pode me ter. Pare de falar e faca alguma coisa.', tone: 'provocativa', next_node_id: 'node_020', affinity_impact: 1 },
                { id: 'c19c', label: 'Voce e completamente louco. Me deixe sair dessa sala agora.', tone: 'fria', next_node_id: 'node_020', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 19, chapter: 'cap_02' }
        },
        'node_020': {
            node_id: 'node_020',
            avatar_id: 'kang-taejun',
            message_text: 'Louco? Talvez. Mas voce nao vai a lugar nenhum. *Ele puxa voce da cadeira pelos bracos em um movimento brusco, fazendo o seu corpo colidir contra o peito rigido dele.* Chega de joguinhos. Eu cansei de esperar.',
            typing_delay_ms: 3000,
            choices: [
                { id: 'c20', label: '...', tone: 'submissa', next_node_id: 'node_021', affinity_impact: 0 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 20, chapter: 'cap_02' }
        },

        /* ===== CAPITULO 3 — Climax na mesa de mogno (nos 21-30) ===== */

        'node_021': {
            node_id: 'node_021',
            avatar_id: 'kang-taejun',
            message_text: '*Ele vira o seu corpo com facilidade e te empurra contra a borda da pesada mesa de mogno. Com um movimento violento do braco, ele joga todos os relatorios e o notebook no chao. O som assusta, mas a forma como ele te olha paralisa voce.*',
            typing_delay_ms: 3200,
            choices: [
                { id: 'c21a', label: 'Sr. Kang... os documentos... *Sussurro, com os olhos arregalados.*', tone: 'submissa', next_node_id: 'node_022', affinity_impact: 1 },
                { id: 'c21b', label: 'Sempre tao dramatico para chamar a minha atencao.', tone: 'provocativa', next_node_id: 'node_022', affinity_impact: 1 },
                { id: 'c21c', label: 'Voce enlouqueceu? O que esta fazendo?!', tone: 'fria', next_node_id: 'node_022', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 21, chapter: 'cap_03' }
        },
        'node_022': {
            node_id: 'node_022',
            avatar_id: 'kang-taejun',
            message_text: 'Foda-se os documentos. *Ele da um passo a frente, forcando os joelhos dele entre as suas pernas para abrir espaco, prendendo voce completamente contra a borda da mesa.* Eu passei as ultimas tres semanas fingindo que voce era so mais uma funcionaria enquanto o seu perfume me enlouquecia.',
            typing_delay_ms: 3500,
            choices: [
                { id: 'c22a', label: '*Eu seguro os ombros largos dele, sentindo o calor atraves do terno.*', tone: 'submissa', next_node_id: 'node_023', affinity_impact: 1 },
                { id: 'c22b', label: 'Demorou tres semanas para perder o controle, chefe? Que decepcao.', tone: 'provocativa', next_node_id: 'node_023', affinity_impact: 1 },
                { id: 'c22c', label: 'Saia de perto de mim, agora.', tone: 'fria', next_node_id: 'node_023', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 22, chapter: 'cap_03' }
        },
        'node_023': {
            node_id: 'node_023',
            avatar_id: 'kang-taejun',
            message_text: '*Ele leva uma mao ate a propria gravata de seda preta e a puxa lentamente, desfazendo o no perfeito. Os olhos escuros e predatorios nao desviam dos seus por um segundo sequer.* Eu nao perco o controle. Eu tomo o controle. E eu vou provar isso para voce agora mesmo.',
            typing_delay_ms: 3200,
            choices: [
                { id: 'c23a', label: 'O que voce vai fazer com essa gravata...?', tone: 'submissa', next_node_id: 'node_024', affinity_impact: 1 },
                { id: 'c23b', label: 'Se voce acha que vai me amarrar com isso, vai ter que tentar muito.', tone: 'provocativa', next_node_id: 'node_024', affinity_impact: 1 },
                { id: 'c23c', label: 'Pare com esse teatro. Isso nao tem graca.', tone: 'fria', next_node_id: 'node_024', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 23, chapter: 'cap_03' }
        },
        'node_024': {
            node_id: 'node_024',
            avatar_id: 'kang-taejun',
            message_text: '*Ele desliza a seda da gravata pelos seus pulsos, em um toque gelado que arrepia toda a sua espinha. O rosto dele desce ate a curva do seu pescoco, e a respiracao quente dele queima a sua pele.* Nao e teatro. Eu quero ouvir voce dizer.',
            typing_delay_ms: 3200,
            choices: [
                { id: 'c24a', label: 'Dizer... dizer o que? *Minha voz sai falha e fraca.*', tone: 'submissa', next_node_id: 'node_025', affinity_impact: 1 },
                { id: 'c24b', label: 'Eu nao obedeco a ordens desse tipo.', tone: 'provocativa', next_node_id: 'node_025', affinity_impact: 1 },
                { id: 'c24c', label: 'Eu nao vou dizer nada que voce mande.', tone: 'fria', next_node_id: 'node_025', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 24, chapter: 'cap_03' }
        },
        'node_025': {
            node_id: 'node_025',
            avatar_id: 'kang-taejun',
            message_text: '*Ele morde o lobulo da sua orelha levemente, enviando um choque eletrico pelo seu corpo, e sussurra com a voz rouca:* Diga que o estagiario nao significa nada. Diga que ninguem mais pode tocar em voce. Diga que voce pertence a este escritorio. A mim.',
            typing_delay_ms: 3500,
            choices: [
                { id: 'c25a', label: 'Eu... eu sou sua, Tae-jun.', tone: 'submissa', next_node_id: 'node_026', affinity_impact: 1 },
                { id: 'c25b', label: 'Me faca admitir isso, se for capaz.', tone: 'provocativa', next_node_id: 'node_026', affinity_impact: 1 },
                { id: 'c25c', label: 'Eu sou dona de mim mesma.', tone: 'fria', next_node_id: 'node_026', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 25, chapter: 'cap_03' }
        },
        'node_026': {
            node_id: 'node_026',
            avatar_id: 'kang-taejun',
            message_text: '*Ele da um sorriso enviesado, satisfeito com o seu tom, e passa a gravata de seda ao redor dos seus pulsos, cruzando o tecido para te imobilizar levemente contra a mesa.* Excelente. Agora que resolvemos isso, vamos mudar as regras do seu contrato de trabalho.',
            typing_delay_ms: 3200,
            choices: [
                { id: 'c26', label: '...', tone: 'submissa', next_node_id: 'node_027', affinity_impact: 0 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 26, chapter: 'cap_03' }
        },
        'node_027': {
            node_id: 'node_027',
            avatar_id: 'kang-taejun',
            message_text: '*A mao livre dele, grande e quente, desliza devagar pela sua coxa, subindo milimetro por milimetro por baixo da sua saia lapis. O olhar dele escurece de puro desejo.* A regra numero um e que, nesta sala, eu nao sou o seu chefe. Eu sou o seu dono.',
            typing_delay_ms: 3500,
            choices: [
                { id: 'c27a', label: '*Eu ofego quando a mao dele sobe mais um pouco, apertando a minha coxa.*', tone: 'submissa', next_node_id: 'node_028', affinity_impact: 1 },
                { id: 'c27b', label: 'Donos costumam cuidar muito bem do que e deles. Me mostre como.', tone: 'provocativa', next_node_id: 'node_028', affinity_impact: 1 },
                { id: 'c27c', label: 'Voce esta indo longe demais, Kang Tae-jun.', tone: 'fria', next_node_id: 'node_028', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 27, chapter: 'cap_03' }
        },
        'node_028': {
            node_id: 'node_028',
            avatar_id: 'kang-taejun',
            message_text: 'Longe demais? Eu ainda nem comecei. *Ele aperta a sua coxa com firmeza, enquanto a outra mao puxa a gravata, forcando o seu corpo a se arquear contra ele.* Eu vou te desmanchar em cima dessa mesa ate voce esquecer o proprio nome. E quando alguem bater naquela porta de novo, eu vou fazer voce gemer o meu.',
            typing_delay_ms: 3500,
            choices: [
                { id: 'c28a', label: 'Tae-jun... por favor...', tone: 'submissa', next_node_id: 'node_029', affinity_impact: 1 },
                { id: 'c28b', label: 'Eu duvido que voce consiga me fazer perder o controle.', tone: 'provocativa', next_node_id: 'node_029', affinity_impact: 1 },
                { id: 'c28c', label: 'Voce nao teria coragem.', tone: 'fria', next_node_id: 'node_029', affinity_impact: -1 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 28, chapter: 'cap_03' }
        },
        'node_029': {
            node_id: 'node_029',
            avatar_id: 'kang-taejun',
            message_text: '*Ele para. A expressao dele se torna mortalmente seria. A brincadeira acabou. Ele segura o seu rosto com possessao, os olhos queimando em chamas escuras.* Preste muita atencao no que eu vou dizer. Se eu avancar essa linha agora, nao tem volta. Eu nao serei profissional amanha. Eu vou ser obcecado. Voce vai ser minha vinte e quatro horas por dia.',
            typing_delay_ms: 3500,
            choices: [
                { id: 'c29', label: '...', tone: 'submissa', next_node_id: 'node_030', affinity_impact: 0 }
            ],
            is_paywall_trigger: false,
            meta: { interaction_index: 29, chapter: 'cap_03' }
        },
        'node_030': {
            node_id: 'node_030',
            avatar_id: 'kang-taejun',
            message_text: '*Ele solta a gravata dos seus pulsos, te dando a chance de fugir. Mas a mao dele desliza ate o botao da sua camisa, pronto para desfaze-lo.* Estou te dando a ultima chance de correr, secretaria. Fique e sofra as consequencias, ou saia da minha sala agora. Escolha.',
            typing_delay_ms: 3500,
            choices: [
                { id: 'c30a', label: 'Eu fico. Eu quero que voce tire a minha camisa.', tone: 'submissa', next_node_id: 'node_031', affinity_impact: 1 },
                { id: 'c30b', label: 'Voce fala demais. Tira logo.', tone: 'provocativa', next_node_id: 'node_031', affinity_impact: 1 },
                { id: 'c30c', label: 'Eu nao vou a lugar nenhum. Termine o que comecou.', tone: 'fria', next_node_id: 'node_031', affinity_impact: -1 }
            ],
            is_paywall_trigger: true,
            meta: { interaction_index: 30, chapter: 'cap_03' }
        }
    }
};

/* ---------- Push Notification ---------- */

var KW_DEMO_PUSH = {
    trigger_time_s: 10,
    avatar_id: 'kang-taejun',
    preview_text: 'Kang Tae-jun te enviou uma mensagem as 23h40...',
    entry_node_id: 'node_001',
    story_id: 'demo-kang-taejun-01'
};
