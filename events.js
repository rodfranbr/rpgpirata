// Mensagens de navegação que aparecem enquanto o jogador explora
const navigationMessages = [
    "O capitão do navio pirata segue rumo ao norte em busca de encontrar novas terras para serem exploradas.",
    "Um grupo de golfinhos acompanha o barco pirata enquanto a tripulação os observa com curiosidade.",
    "No horizonte é possível ver o brilho do sol e a esperança de encontrar tesouros lendários.",
    "A tripulação canta canções piratas enquanto repara pequenos danos causados pela última tempestade.",
    "O primeiro oficial aponta para um cardume de peixes coloridos que circundam o navio.",
    "O papagaio do capitão grasna impaciente, como se quisesse indicar uma direção específica.",
    "Os marinheiros contam histórias sobre monstros marinhos que devoram navios inteiros.",
    "O cozinheiro do navio prepara uma refeição usando os últimos peixes pescados pela tripulação.",
    "Um marujo avista uma garrafa flutuando ao longe, mas ela escapa antes que consigam pegá-la.",
    "O navio balança suavemente enquanto navega por águas tranquilas em busca de aventuras.",
    "Alguns membros da tripulação jogam dados no convés, apostando pequenas quantidades de ouro.",
    "O navegador consulta suas cartas marítimas, tentando identificar ilhas desconhecidas.",
    "O rum começa a acabar e alguns piratas já começam a reclamar. Precisamos encontrar um porto logo!",
    "Uma leve brisa sopra nas velas, impulsionando o navio através das águas cristalinas.",
    "O velho pirata com uma perna de pau conta novamente a história de como perdeu sua perna para um tubarão.",
    "O céu estrelado guia o navio durante a noite, com a lua iluminando o caminho à frente.",
    "O capitão observa o horizonte com sua luneta, em busca de navios mercantes desavisados.",
    "As ondas batem contra o casco do navio em um ritmo hipnotizante.",
    "Uma ilha distante aparece e desaparece na névoa, talvez seja apenas uma ilusão.",
    "A bandeira pirata tremula orgulhosamente no mastro principal, intimidando qualquer navio que se aproxime."
];

// Lista de eventos possíveis
const events = [
    // 1- Ilha perdida inóspita encontrada (50% de chance)
    {
        id: "ilha-perdida",
        title: "🏝️ Ilha Perdida Inóspita Encontrada! 🏝️",
        chance: 50, // 50% de chance desse evento ocorrer
        descriptions: [
            "Terra à vista! Um pirata grita do topo do mastro, apontando para uma ilha misteriosa que surge no horizonte.",
            "Todos a bordo comemoram, pois o capitão acaba de encontrar novas terras para serem exploradas!",
            "Uma ilha desconhecida emerge da névoa matinal. Quem sabe quais segredos e riquezas ela esconde?",
            "Seu contramestre aponta empolgado para uma costa que não aparece em nenhum mapa conhecido!"
        ],
        images: [
            "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/ilha0001.jpeg",
            "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/ilha0002.jpeg",
            "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/ilha0003.jpeg",
            "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/ilha0004.jpeg"
        ],
        actions: [
            // 1a) escavar por busca de tesouro
            {
                name: "Escavar por Tesouro",
                cost: 50,
                duration: 30,
                startMessage: "Sua tripulação começa a escavar freneticamente em busca de tesouros enterrados.",
                image: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/tesouro0001.jpeg",
                result: {
                    type: "loot",
                    findChance: 70, // 70% de chance de encontrar algo
                    goldMin: 0,
                    goldMax: 300,
                    noTreasureImage: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/tesouro0005.jpeg",
                    emptyChestImage: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/tesouro0004.jpeg",
                    treasureImage: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/tesouro0003.jpeg"
                }
            },
            // 1b) Coletar Recursos
            {
                name: "Coletar Recursos",
                cost: 10,
                duration: 30,
                startMessage: "Seus homens se espalham pela ilha, coletando madeira, frutas e outros recursos valiosos.",
                image: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/recursos0001.jpeg",
                result: {
                    type: "resource",
                    goldMin: 10,
                    goldMax: 30,
                    message: "Sua tripulação coletou diversos recursos que podem ser vendidos no próximo porto.",
                    image: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/recursos0001.jpeg"
                }
            },
            // 1c) explorar a ilha
            {
                name: "Explorar a Ilha",
                cost: 25,
                duration: 60,
                startMessage: "O capitão lidera uma expedição para explorar os mistérios da ilha desconhecida.",
                image: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/explorar0001.jpeg",
                result: {
                    type: "resource",
                    goldMin: 25,
                    goldMax: 100,
                    message: "O pirata caminhava pela floresta da ilha quando avistou uma caverna, e lá encontrou um artefato antigo valioso!",
                    image: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/explorar0001.jpeg"
                }
            }
        ]
    },
    
    // 2- Avistar navio pirata inimigo (5% de chance)
    {
        id: "navio-inimigo",
        title: "⚔️ Navio Pirata Inimigo Avistado! ⚔️",
        chance: 5, // 5% de chance desse evento ocorrer
        descriptions: [
            "Velas negras no horizonte! Um marinheiro grita do alto do mastro. É um navio pirata rival!",
            "O contramestre aponta para um navio com bandeira pirata que se aproxima rapidamente. Prepare-se para o confronto!",
            "Um navio desconhecido surge na linha do horizonte. Seus canhões estão a postos e a bandeira pirata tremula no mastro.",
            "Seu imediato sobe correndo ao convés: 'Capitão! Navio pirata se aproximando por bombordo!'"
        ],
        images: ["https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/batalha_naval0002.jpeg"],
        actions: [
            // 2a) Batalhar
            {
                name: "Batalhar",
                cost: 0,
                duration: 60,
                startMessage: "Você ordena que os canhões sejam preparados. A batalha naval está prestes a começar!",
                image: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/batalha_naval0002.jpeg",
                result: {
                    type: "chance",
                    successChance: 50, // 50% de chance de vencer
                    successGoldMin: 100,
                    successGoldMax: 1000,
                    successMessage: "Após uma intensa batalha, seu navio saiu vitorioso! A tripulação inimiga se rendeu e você conquistou o butim deles.",
                    successImage: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/batalha_naval0003.jpeg",
                    failureGoldPercent: {
                        min: 1,
                        max: 50
                    },
                    failureMessage: "A batalha foi feroz, mas o navio inimigo era mais poderoso! Vocês tiveram que recuar, sofrendo perdas significativas.",
                    failureImage: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/batalha_naval0004.jpeg"
                }
            },
            // 2b) Negociar Mercadorias
            {
                name: "Negociar Mercadorias",
                cost: 0,
                duration: 60,
                startMessage: "Você ergue uma bandeira branca e propõe uma negociação pacífica com o outro navio pirata.",
                image: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/mercante0002.jpeg",
                result: {
                    type: "resource",
                    goldMin: 50,
                    goldMax: 100,
                    message: "O capitão do seu barco negociou com os piratas do outro barco e vocês trocaram um pouco de madeira em troca de alimentos. O negócio foi lucrativo!",
                    image: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/mercante0002.jpeg"
                }
            }
        ]
    },
    
    // 3- Enfrentar uma tempestade (5% de chance)
    {
        id: "tempestade",
        title: "🌊 Tempestade à Vista! 🌊",
        chance: 5, // 5% de chance desse evento ocorrer
        descriptions: [
            "O céu escurece rapidamente e o mar se agita. Uma tempestade violenta se aproxima!",
            "Raios cortam o céu e ondas gigantes se formam no horizonte. Seu navegador grita: 'Tempestade se aproximando, capitão!'",
            "O vento muda bruscamente e as nuvens negras se formam. Seu navio está prestes a enfrentar uma terrível tempestade.",
            "Seu primeiro oficial alerta: 'Capitão, uma tempestade se forma ao norte! Não temos como evitá-la!'"
        ],
        images: ["https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/tempestade0001.jpeg"],
        actions: [
            // Enfrentar a tempestade (única opção)
            {
                name: "Enfrentar a Tempestade",
                cost: 0,
                duration: 60,
                startMessage: "O navio se prepara para enfrentar a fúria dos mares. Todos os marinheiros estão a postos!",
                image: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/tempestade0001.jpeg",
                result: {
                    type: "chance",
                    successChance: 80, // 80% de chance de não ser danificado
                    successGoldMin: 0,
                    successGoldMax: 0,
                    successMessage: "Seu navio conseguiu atravessar a tempestade sem sofrer danos significativos! A perícia do timoneiro salvou a todos.",
                    successImage: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/tempestade0002.jpeg",
                    failureGoldPercent: {
                        min: 1,
                        max: 10
                    },
                    failureMessage: "A tempestade foi mais violenta do que o esperado! Seu navio sofreu danos e alguns recursos foram perdidos no mar.",
                    failureImage: "https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/danificado0001.jpeg"
                }
            }
        ]
    }
];
