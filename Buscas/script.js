const TAMANHO_BASE = 5000;
const NUM_BUSCAS_TESTE = 100; // Repetir para calcular a média
let baseDadosLista = []; // Para busca Sequencial e Indexada
let baseDadosHashMap = new Map(); // Para busca por HashMap

const statusCarregamento = document.getElementById('statusCarregamento');
const btnBuscar = document.getElementById('btnBuscar');
const targetInfo = document.getElementById('targetInfo');
const resultFound = document.getElementById('resultFound');

// --- 1. FUNÇÃO PARA POPULAR A BASE DE DADOS ---
function carregarBaseDeDados() {
    baseDadosLista = [];
    baseDadosHashMap = new Map();
    statusCarregamento.textContent = " Carregando... por favor, aguarde...";
    
    // Usamos setTimeout para não travar a interface enquanto a base é criada
    setTimeout(() => {
        const startTime = performance.now();
        for (let i = 1; i <= TAMANHO_BASE; i++) {
            const usuario = {
                id: i,
                nome: `Usuário ${i}`,
                email: `usuario${i}@email.com`
            };
            
            // Popula a Lista
            baseDadosLista.push(usuario);
            
            // Popula o HashMap (Map no JavaScript)
            baseDadosHashMap.set(i, usuario);
        }
        const endTime = performance.now();
        const tempoGasto = (endTime - startTime).toFixed(2);
        
        statusCarregamento.textContent = ` Base de Dados Carregada em ${tempoGasto} ms.`;
        btnBuscar.disabled = false;
        document.getElementById('btnCarregar').disabled = true;
    }, 10);
}

// --- 2. ALGORITMOS DE BUSCA ---

// O(n): Verifica um por um
function buscaSequencial(lista, idBusca) {
    for (const registro of lista) {
        if (registro.id === idBusca) {
            return registro;
        }
    }
    return null;
}

// O(log n): Usa Pesquisa Binária em uma lista ORDENADA por ID
function buscaIndexadaBinaria(listaOrdenada, idBusca) {
    let low = 0;
    let high = listaOrdenada.length - 1;
    
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        
        if (listaOrdenada[mid].id === idBusca) {
            return listaOrdenada[mid];
        } else if (listaOrdenada[mid].id < idBusca) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return null;
}

// O(1): Acesso direto usando a chave
function buscaHashMap(hashmap, idBusca) {
    return hashmap.get(idBusca) || null;
}

// --- 3. FUNÇÃO DE EXECUÇÃO E MEDIÇÃO DE TEMPO ---

function executarBuscasAleatorias() {
    if (baseDadosLista.length === 0) {
        alert("Por favor, carregue a base de dados primeiro.");
        return;
    }
    
    // Escolhe um ID aleatório
    const idAlvo = Math.floor(Math.random() * TAMANHO_BASE) + 1;
    targetInfo.innerHTML = `Busca em andamento... Alvo ID: **${idAlvo}**`;
    
    let tempoTotalSequencial = 0;
    let tempoTotalBinaria = 0;
    let tempoTotalHashMap = 0;
    let resultado;

    // Repete a busca N vezes para calcular a média e melhorar a precisão
    for (let i = 0; i < NUM_BUSCAS_TESTE; i++) {
        // Sequencial
        let start = performance.now() * 1000000; // Multiplica para nanossegundos (aprox.)
        resultado = buscaSequencial(baseDadosLista, idAlvo);
        let end = performance.now() * 1000000;
        tempoTotalSequencial += (end - start);
        
        // Indexada (Binária)
        start = performance.now() * 1000000;
        buscaIndexadaBinaria(baseDadosLista, idAlvo);
        end = performance.now() * 1000000;
        tempoTotalBinaria += (end - start);

        // HashMap
        start = performance.now() * 1000000;
        buscaHashMap(baseDadosHashMap, idAlvo);
        end = performance.now() * 1000000;
        tempoTotalHashMap += (end - start);
    }
    
    // Cálculo das médias
    const tempoMedioSequencial = (tempoTotalSequencial / NUM_BUSCAS_TESTE).toFixed(2);
    const tempoMedioBinaria = (tempoTotalBinaria / NUM_BUSCAS_TESTE).toFixed(2);
    const tempoMedioHashMap = (tempoTotalHashMap / NUM_BUSCAS_TESTE).toFixed(2);
    
    // Atualiza a interface
    document.querySelector('#rowSequencial .tempo').textContent = `${tempoMedioSequencial} ns`;
    document.querySelector('#rowIndexada .tempo').textContent = `${tempoMedioBinaria} ns`;
    document.querySelector('#rowHashMap .tempo').textContent = `${tempoMedioHashMap} ns`;
    
    targetInfo.innerHTML = ` ID de Busca Aleatório: **${idAlvo}**`;
    resultFound.textContent = `Resultado encontrado: ID ${resultado.id}, Nome: ${resultado.nome}`;
}

