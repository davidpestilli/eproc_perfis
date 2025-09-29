// Dados extraídos do CSV e do relatório
const rawData = [
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "NÃO",
        localidade: "SIM",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 0,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "PARCIALMENTE",
        comentarios: "Só visualiza documentos feitos pelas unidades judiciais",
        processo: ""
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "NÃO",
        localidade: "SIM",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 1,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "NÃO",
        comentarios: "",
        processo: ""
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "NÃO",
        localidade: "SIM",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 0,
        permissaoExpressa: "SIM",
        visualizaDocumentos: "SIM",
        comentarios: "Não é possível dar permissão expressa para sigilo 0 diretamente. No entanto, ao elevar o sigilo, conceder permissão expressa para aquele sigilo e depois retornar o nível de sigilo para 0, o sistema permite adequar a permissão anteriormente dada ao sigilo atual do processo. Assim, é possível contornar o sistema e conceder permissão expressa para sigilo 0",
        processo: ""
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "NÃO",
        localidade: "SIM",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 1,
        permissaoExpressa: "PARCIALMENTE",
        visualizaDocumentos: "PARCIALMENTE",
        comentarios: "Concedida permissão para sigilo 0, ele somente não verá documentos sob sigilo 1 e acima",
        processo: ""
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "NÃO",
        localidade: "SIM",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 1,
        permissaoExpressa: "SIM",
        visualizaDocumentos: "SIM",
        comentarios: "A permissão expressa concede acesso a todos os documentos dos autos de sigilo inferior ao permitido",
        processo: ""
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "NÃO",
        localidade: "NÃO",
        rito: "NÃO",
        sigiloProcesso: 0,
        sigiloDocumento: 0,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "PARCIALMENTE",
        comentarios: "Só visualiza documentos feitos pelas unidades judiciais",
        processo: ""
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "NÃO",
        localidade: "NÃO",
        rito: "NÃO",
        sigiloProcesso: 0,
        sigiloDocumento: 1,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "NÃO",
        comentarios: "",
        processo: ""
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "NÃO",
        localidade: "SIM",
        rito: "NÃO",
        sigiloProcesso: 0,
        sigiloDocumento: 0,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "PARCIALMENTE",
        comentarios: "Só visualiza documentos feitos pelas unidades judiciais",
        processo: ""
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "PARCIALMENTE",
        localidade: "SIM",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 1,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "SIM",
        comentarios: "O Processo possui Vista ao MP, mas não possui vinculação direta com o procurador.",
        processo: ""
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "NÃO",
        localidade: "SIM",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 0,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "PARCIALMENTE",
        comentarios: "O analista não consegue ver os documentos do processo, Só visualiza documentos feitos pelas unidades judiciais",
        processo: ""
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "NÃO",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 0,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "NÃO",
        comentarios: "",
        processo: ""
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "NÃO",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 1,
        sigiloDocumento: 0,
        permissaoExpressa: "SIM",
        visualizaDocumentos: "SIM",
        comentarios: "O Analista consegue visualizar a documentação com a permissão expressa.",
        processo: ""
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "SIM",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 0,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "SIM",
        comentarios: "O analista consegue visualizar o documento mesmo não estando na localidade de atuação em que está cadastrado, pois o procurador vinculado está devidamente cadastrado na localidade.",
        processo: "4000007-02.2025.8.26.0016"
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "PARCIALMENTE",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 1,
        sigiloDocumento: 0,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "NÃO",
        comentarios: "O Processo possui Vista ao MP, mas não possui vinculação direta com o procurador.",
        processo: "4000171-12.2025.8.26.0001"
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "SIM",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 1,
        sigiloDocumento: 0,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "SIM",
        comentarios: "O analista consegue visualizar o documento mesmo não estando na localidade de atuação em que está cadastrado, pois o procurador vinculado está devidamente cadastrado na localidade.",
        processo: "4000171-12.2025.8.26.0001"
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "SIM",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 2,
        sigiloDocumento: 0,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "SIM",
        comentarios: "Nesse caso só foi aumentado o nivel de sigilo e o analista continua conseguindo visualizar.",
        processo: "4000171-12.2025.8.26.0001"
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "NÃO",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 2,
        sigiloDocumento: 0,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "NÃO",
        comentarios: "",
        processo: "4000164-20.2025.8.26.0001"
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "PARCIALMENTE",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 2,
        sigiloDocumento: 0,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "SIM",
        comentarios: "O Processo possui Vista ao MP, mas não possui vinculação direta com o procurador.",
        processo: "4000164-20.2025.8.26.0001"
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "SIM",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 2,
        sigiloDocumento: 0,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "SIM",
        comentarios: "O analista consegue visualizar o documento mesmo não estando na localidade de atuação em que está cadastrado, pois o procurador vinculado está devidamente cadastrado na localidade.",
        processo: "4000164-20.2025.8.26.0001"
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "NÃO",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 2,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "NÃO",
        comentarios: "Utilizei um procurador do MP para protocolar o processo, mas não o diretamente vinculado.",
        processo: "4000269-94.2025.8.26.0001"
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "PARCIALMENTE",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 2,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "SIM",
        comentarios: "O Processo possui Vista ao MP, mas não possui vinculação direta com o procurador.",
        processo: "4000269-94.2025.8.26.0001"
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "SIM",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 2,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "SIM",
        comentarios: "O analista consegue visualizar o documento mesmo não estando na localidade de atuação em que está cadastrado, pois o procurador vinculado está devidamente cadastrado na localidade.",
        processo: ""
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "NÃO",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 4,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "NÃO",
        comentarios: "Utilizei um procurador do MP para protocolar o processo, mas não o diretamente vinculado.",
        processo: "4000270-79.2025.8.26.0001"
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "PARCIALMENTE",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 4,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "NÃO",
        comentarios: "O Processo possui Vista ao MP, mas não possui vinculação direta com o procurador.",
        processo: "4000270-79.2025.8.26.0001"
    },
    {
        perfil: "Analista Procuradoria",
        procuradorVinculado: "SIM",
        localidade: "NÃO",
        rito: "SIM",
        sigiloProcesso: 0,
        sigiloDocumento: 4,
        permissaoExpressa: "NÃO",
        visualizaDocumentos: "NÃO",
        comentarios: "",
        processo: "4000270-79.2025.8.26.0001"
    }
];

// Cenários estruturados do relatório
const scenarios = [
    {
        id: "2.1",
        titulo: "Processo sem sigilo e sem Procurador atuante",
        sigiloProcesso: 0,
        sigiloDocumentos: 0,
        procurador: false,
        entidade: false,
        resultado: "PARCIAL",
        descricao: "Analista possui acesso somente a documentos emanados das unidades judiciais (Ex: decisões, atos ordinatórios etc.)"
    },
    {
        id: "2.2",
        titulo: "Processo sem sigilo; documentos judiciais com sigilo 1 ou superior; e sem Procurador atuante",
        sigiloProcesso: 0,
        sigiloDocumentos: 1,
        procurador: false,
        entidade: false,
        resultado: "NEGADO",
        descricao: "Ao aumentar o nível de sigilo dos documentos judiciais, o analista perde acesso a eles. Assim, o analista não consegue visualizar nenhum documento."
    },
    {
        id: "2.3",
        titulo: "Processo sem sigilo, sem Procurador atuante, mas com Entidade listada na capa dos autos",
        sigiloProcesso: 0,
        sigiloDocumentos: "0-2",
        procurador: false,
        entidade: true,
        resultado: "TOTAL",
        descricao: "Refere-se à situação na qual a entidade está inserida na capa do processo, mas ainda não foi intimada e, portanto, não há procuradores atuando no processo. O analista terá acesso a todos os documentos, inclusive documentos com sigilo até o nível 2."
    },
    {
        id: "2.4",
        titulo: "Processo sob segredo de justiça e sem Procurador atuante",
        sigiloProcesso: 1,
        sigiloDocumentos: 0,
        procurador: false,
        entidade: false,
        resultado: "NEGADO",
        descricao: "O sigilo do processo tem prioridade sob o sigilo dos documentos, de forma que mesmo que não haja sigilo nos documentos, o usuário precisa ter acesso a sigilo 1 para poder visualizá-lo. Nesse cenário o Analista não consegue visualizar nem documentos e nem eventos do processo."
    },
    {
        id: "2.5",
        titulo: "Processo sob segredo de justiça, sem Procurador atuante, mas com Entidade listada na capa dos autos",
        sigiloProcesso: 1,
        sigiloDocumentos: 0,
        procurador: false,
        entidade: true,
        resultado: "PARCIAL",
        descricao: "Embora não sejam exibidos os eventos, o botão 'Árvore' concede acesso aos documentos dos autos."
    },
    {
        id: "2.6",
        titulo: "Processo com sigilo 2 e superior, e sem Procurador atuante",
        sigiloProcesso: 2,
        sigiloDocumentos: 0,
        procurador: false,
        entidade: false,
        resultado: "NEGADO",
        descricao: "O Analista não terá acesso nem à capa do processo. A busca retornará apenas mensagem de que o processo é sigiloso."
    },
    {
        id: "2.7",
        titulo: "Processo com sigilo 2, sem Procurador atuante, mas com Entidade listada na capa dos autos",
        sigiloProcesso: 2,
        sigiloDocumentos: 0,
        procurador: false,
        entidade: true,
        resultado: "TOTAL",
        descricao: "O analista tem acesso à capa do processo, aos eventos e aos documentos dos autos. ACREDITA-SE SE TRATAR DE ERRO DE SISTEMA.",
        anomalia: true
    },
    {
        id: "2.8",
        titulo: "Processo com sigilo 3 e superior, sem Procurador atuante, mas com Entidade listada na capa dos autos",
        sigiloProcesso: 3,
        sigiloDocumentos: 0,
        procurador: false,
        entidade: true,
        resultado: "NEGADO",
        descricao: "O Analista perderá o acesso à capa do processo. A busca retornará apenas mensagem de que o processo é sigiloso."
    },
    {
        id: "2.9",
        titulo: "Processo com sigilo até nível 2 e com Procurador atuante",
        sigiloProcesso: "0-2",
        sigiloDocumentos: "0-2",
        procurador: true,
        entidade: false,
        resultado: "TOTAL",
        descricao: "Atuando no processo o Procurador, o analista terá acesso a todos os eventos e documentos dos autos, até o sigilo 2."
    },
    {
        id: "2.10",
        titulo: "Processo com sigilo 3 e superior, e com Procurador atuante",
        sigiloProcesso: 3,
        sigiloDocumentos: 0,
        procurador: true,
        entidade: false,
        resultado: "NEGADO",
        descricao: "Ainda que haja atuação do Procurador, processos com sigilo 3 e além ainda estão fora do acesso permitido ao analista. Ao buscar por tais processos, apenas será exibida mensagem de que o processo é sigiloso."
    }
];

// Estatísticas calculadas
const stats = {
    totalCenarios: 26,
    acessoTotal: 9,
    acessoParcial: 7,
    acessoNegado: 10,
    semProcurador: 16,
    comProcurador: 6,
    vinculacaoParcial: 4,
    sigilo0: 15,
    sigilo1: 5,
    sigilo2: 6
};