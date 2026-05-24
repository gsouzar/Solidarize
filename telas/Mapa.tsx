import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
// Importação correta para não dar o aviso no terminal
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIAS = ['Todos', 'Alimentação', 'Saúde', 'Educação', 'Assistência'];

const TIPO_CONFIG: Record<string, { cor: string; icone: any; bgLight: string }> = {
  Alimentação: { cor: '#E65100', icone: 'restaurant',  bgLight: '#FFF3E0' },
  Saúde:       { cor: '#1B5E20', icone: 'medkit',      bgLight: '#E8F5E9' },
  Educação:    { cor: '#0D47A1', icone: 'school',      bgLight: '#E3F2FD' },
  Assistência: { cor: '#6A1B9A', icone: 'people',      bgLight: '#F3E5F5' },
};

interface Local {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  horario: string;
  endereco: string;
  telefone: string;
  latitude: number;
  longitude: number;
}

const LOCAIS: Local[] = [
  {
    id: '1', nome: 'Cozinha Comunitária Sé', tipo: 'Alimentação',
    descricao: 'Refeições gratuitas seg–sex, 11h–14h',
    horario: 'Seg–Sex: 11h às 14h',
    endereco: 'Praça da Sé, 21 – Centro',
    telefone: '(11) 3333-1111',
    latitude: -23.5505, longitude: -46.6333,
  },
  {
    id: '2', nome: 'Clínica Popular Esperança', tipo: 'Saúde',
    descricao: 'Consultas sem custo para a comunidade',
    horario: 'Seg–Sáb: 8h às 18h',
    endereco: 'Av. Paulista, 900 – Bela Vista',
    telefone: '(11) 3333-2222',
    latitude: -23.5580, longitude: -46.6450,
  },
  {
    id: '3', nome: 'Cursos de Informática Gratuitos', tipo: 'Educação',
    descricao: 'Turmas abertas, certificado ao final',
    horario: 'Seg, Qua e Sex: 9h–11h e 14h–16h',
    endereco: 'Rua Augusta, 1200 – Consolação',
    telefone: '(11) 3333-3333',
    latitude: -23.5450, longitude: -46.6280,
  },
  {
    id: '4', nome: 'Banco de Alimentos Solidários', tipo: 'Alimentação',
    descricao: 'Distribuição de cestas básicas toda semana',
    horario: 'Ter e Qui: 9h às 12h',
    endereco: 'Rua da Consolação, 400 – República',
    telefone: '(11) 3333-4444',
    latitude: -23.5520, longitude: -46.6380,
  },
  {
    id: '5', nome: 'Centro de Apoio Jurídico', tipo: 'Assistência',
    descricao: 'Orientação jurídica gratuita para a população',
    horario: 'Seg–Sex: 9h às 17h',
    endereco: 'Rua Boa Vista, 170 – Centro',
    telefone: '(11) 3333-5555',
    latitude: -23.5470, longitude: -46.6310,
  },
  {
    id: '6', nome: 'Escola de Música Popular', tipo: 'Educação',
    descricao: 'Aulas de violão, flauta e percussão sem custo',
    horario: 'Ter, Qui e Sáb: 10h às 19h',
    endereco: 'Rua Vergueiro, 500 – Liberdade',
    telefone: '(11) 3333-6666',
    latitude: -23.5555, longitude: -46.6395,
  },
  {
    id: '7', nome: 'Posto de Vacinação Comunitário', tipo: 'Saúde',
    descricao: 'Vacinação gratuita para todas as idades',
    horario: 'Seg–Sex: 7h às 16h | Sáb: 8h às 12h',
    endereco: 'Av. Faria Lima, 500 – Pinheiros',
    telefone: '(11) 3333-7777',
    latitude: -23.5610, longitude: -46.6490,
  },
];

export default function Mapa() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [localSelecionado, setLocalSelecionado] = useState<Local | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);

  const locaisFiltrados = categoriaAtiva === 'Todos'
    ? LOCAIS
    : LOCAIS.filter(l => l.tipo === categoriaAtiva);

  const abrirModalLocal = (id: string) => {
    const local = LOCAIS.find(l => l.id === id);
    if (local) {
      setLocalSelecionado(local);
      setModalVisivel(true);
    }
  };

  // Marcadores baseados no seu código funcional, mas enviando a mensagem ao clicar no botão
  const marcadores = locaisFiltrados.map(l => {
    const cor = TIPO_CONFIG[l.tipo]?.cor ?? '#333';
    return `
      L.marker([${l.latitude}, ${l.longitude}], {
        icon: L.divIcon({
          className: '',
          html: '<div style="background:${cor};width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        })
      })
      .addTo(map)
      .bindPopup('<b style="color:${cor}">${l.tipo}</b><br/>${l.nome}<br/><small>${l.descricao}</small><br/><button onclick="window.ReactNativeWebView.postMessage(\\'${l.id}\\')" style="background:${cor};color:#fff;border:none;padding:4px 8px;border-radius:4px;margin-top:6px;cursor:pointer;font-size:11px;">Ver detalhes</button>');
    `;
  }).join('\n');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { margin: 0; padding: 0; }
        #map { width: 100vw; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map', { zoomControl: false }).setView([-23.5505, -46.6333], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);
        ${marcadores}
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        
        {/* Filtros em Área Segura */}
        <SafeAreaView style={styles.filtrosContainer} edges={['top']}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtrosScroll}
            contentContainerStyle={styles.filtrosContent}
          >
            {CATEGORIAS.map(cat => {
              const config = TIPO_CONFIG[cat];
              const isAtivo = categoriaAtiva === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filtro, 
                    isAtivo && (cat === 'Todos' ? styles.filtroAtivoPadrao : { backgroundColor: config?.cor, borderColor: config?.cor })
                  ]}
                  onPress={() => setCategoriaAtiva(cat)}
                >
                  {cat !== 'Todos' && config && (
                    <Ionicons
                      name={config.icone}
                      size={13}
                      color={isAtivo ? '#fff' : config.cor}
                      style={{ marginRight: 4 }}
                    />
                  )}
                  {cat === 'Todos' && (
                    <Ionicons name="apps" size={13} color={isAtivo ? '#fff' : '#666'} style={{ marginRight: 4 }} />
                  )}
                  <Text style={[styles.filtroText, isAtivo && styles.filtroTextoAtivo]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>

        {/* Mapa */}
        <WebView
          source={{ html }}
          style={styles.mapa}
          javaScriptEnabled
          originWhitelist={['*']}
          onMessage={(event) => abrirModalLocal(event.nativeEvent.data)}
        />

        {/* Contador */}
        <View style={styles.contador}>
          <Text style={styles.contadorText}>
            {locaisFiltrados.length} local{locaisFiltrados.length !== 1 ? 'is' : ''} encontrado{locaisFiltrados.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Modal de detalhes do local */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisivel}
          onRequestClose={() => setModalVisivel(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {localSelecionado && (() => {
                const config = TIPO_CONFIG[localSelecionado.tipo];
                return (
                  <>
                    {/* Header do Modal */}
                    <View style={[styles.modalHeader, { backgroundColor: config?.cor ?? '#333' }]}>
                      <View style={styles.modalHeaderContent}>
                        <View style={styles.modalIcone}>
                          <Ionicons name={config?.icone} size={24} color={config?.cor} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.modalTipoBadge}>{localSelecionado.tipo}</Text>
                          <Text style={styles.modalTitulo}>{localSelecionado.nome}</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.btnFechar} onPress={() => setModalVisivel(false)}>
                        <Ionicons name="close" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>

                    {/* Conteúdo */}
                    <View style={styles.modalContent}>
                      <Text style={styles.modalDesc}>{localSelecionado.descricao}</Text>

                      {[
                        { icone: 'time-outline', label: 'Horário', valor: localSelecionado.horario },
                        { icone: 'location-outline', label: 'Endereço', valor: localSelecionado.endereco },
                        { icone: 'call-outline', label: 'Telefone', valor: localSelecionado.telefone },
                      ].map((info) => (
                        <View key={info.label} style={styles.modalInfoItem}>
                          <View style={[styles.modalInfoIcone, { backgroundColor: config?.bgLight ?? '#eee' }]}>
                            <Ionicons name={info.icone as any} size={16} color={config?.cor ?? '#333'} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.modalInfoLabel}>{info.label}</Text>
                            <Text style={styles.modalInfoValor}>{info.valor}</Text>
                          </View>
                        </View>
                      ))}

                      <TouchableOpacity
                        style={[styles.btnFecharModal, { backgroundColor: config?.cor ?? '#333' }]}
                        onPress={() => setModalVisivel(false)}
                      >
                        <Text style={styles.btnFecharModalText}>Fechar</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                );
              })()}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  filtrosContainer: {
    position: 'absolute', top: 0, left: 0, right: 0,
    zIndex: 10,
  },
  filtrosScroll: {
    maxHeight: 48, flexGrow: 0, marginTop: 10
  },
  filtrosContent: {
    paddingHorizontal: 16, alignItems: 'center', gap: 8,
  },
  filtro: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 0.5,
    borderColor: '#ccc', backgroundColor: '#fff',
    elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  filtroAtivoPadrao: { backgroundColor: '#333', borderColor: '#333' },
  filtroText: { fontSize: 13, color: '#666' },
  filtroTextoAtivo: { color: '#fff', fontWeight: '600' },
  mapa: { flex: 1 },
  contador: {
    position: 'absolute', bottom: 24, alignSelf: 'center',
    backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6,
  },
  contadorText: { fontSize: 13, fontWeight: '600', color: '#333' },

  // Estilos do Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  modalHeader: { padding: 20, paddingBottom: 16 },
  modalHeaderContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modalIcone: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  modalTipoBadge: { color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  modalTitulo: { color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 22 },
  btnFechar: { position: 'absolute', top: 14, right: 14, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 18, padding: 6 },
  modalContent: { padding: 20 },
  modalDesc: { fontSize: 14, color: '#555', marginBottom: 16, lineHeight: 20 },
  modalInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  modalInfoIcone: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  modalInfoLabel: { fontSize: 10, color: '#999', fontWeight: '600', marginBottom: 1 },
  modalInfoValor: { fontSize: 14, color: '#222', fontWeight: '500' },
  btnFecharModal: { borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginTop: 8 },
  btnFecharModalText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});