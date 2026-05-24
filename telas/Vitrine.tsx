import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ScrollView, Modal,
  Image, SafeAreaView, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ServicoProps {
  id: string;
  nome: string;
  tipo: string;
  distancia: string;
  descricao: string;
  descricaoLonga: string;
  horario: string;
  endereco: string;
  telefone: string;
  gratuito: boolean;
  imagem: any; 
}

const CATEGORIAS = ['Todos', 'Alimentação', 'Saúde', 'Educação', 'Assistência'];

const TIPO_CONFIG: Record<string, { cor: string; bgLight: string; icone: string }> = {
  Alimentação: { cor: '#E65100', bgLight: '#FFF3E0', icone: 'restaurant' },
  Saúde:       { cor: '#1B5E20', bgLight: '#E8F5E9', icone: 'medkit' },
  Educação:    { cor: '#0D47A1', bgLight: '#E3F2FD', icone: 'school' },
  Assistência: { cor: '#6A1B9A', bgLight: '#F3E5F5', icone: 'people' },
};

const SERVICOS: ServicoProps[] = [
  {
    id: '1',
    nome: 'Cozinha Comunitária Sé',
    tipo: 'Alimentação',
    distancia: '1.2km',
    descricao: 'Refeições gratuitas de seg. a sex., 11h–14h.',
    descricaoLonga: 'A Cozinha Comunitária Sé oferece refeições completas e nutritivas para pessoas em situação de vulnerabilidade. Nosso cardápio é elaborado por nutricionistas e servimos aproximadamente 300 refeições por dia.',
    horario: 'Seg–Sex: 11h às 14h',
    endereco: 'Praça da Sé, 21 – Centro, São Paulo',
    telefone: '(11) 3333-1111',
    gratuito: true,
    imagem: require('../assets/cozinha.png'),
  },
  {
    id: '2',
    nome: 'Clínica Popular Esperança',
    tipo: 'Saúde',
    distancia: '3.5km',
    descricao: 'Consultas e exames sem custo para a comunidade.',
    descricaoLonga: 'A Clínica Popular Esperança oferece atendimento médico, odontológico e psicológico gratuito para moradores de baixa renda. Contamos com uma equipe de 25 profissionais voluntários.',
    horario: 'Seg–Sáb: 8h às 18h',
    endereco: 'Av. Paulista, 900 – Bela Vista, São Paulo',
    telefone: '(11) 3333-2222',
    gratuito: true,
    imagem: require('../assets/hospital.png'),
  },
  {
    id: '3',
    nome: 'Cursos de Informática Gratuitos',
    tipo: 'Educação',
    distancia: '0.8km',
    descricao: 'Turmas abertas, certificado ao final do curso.',
    descricaoLonga: 'Oferecemos cursos de informática básica, internet, planilhas e edição de texto para adultos e idosos. As turmas têm no máximo 15 alunos para garantir atenção individualizada.',
    horario: 'Seg, Qua e Sex: 9h às 11h e 14h às 16h',
    endereco: 'Rua Augusta, 1200 – Consolação, São Paulo',
    telefone: '(11) 3333-3333',
    gratuito: true,
    imagem: require('../assets/concurso.png'),
  },
  {
    id: '4',
    nome: 'Banco de Alimentos Solidários',
    tipo: 'Alimentação',
    distancia: '2.1km',
    descricao: 'Distribuição de cestas básicas toda semana.',
    descricaoLonga: 'O Banco de Alimentos Solidários recebe doações de supermercados e restaurantes para distribuir cestas básicas mensais a famílias cadastradas. O cadastro é gratuito e realizado no local.',
    horario: 'Ter e Qui: 9h às 12h',
    endereco: 'Rua da Consolação, 400 – República, São Paulo',
    telefone: '(11) 3333-4444',
    gratuito: true,
    imagem: require('../assets/alimentos.png'), 
  },
  {
    id: '5',
    nome: 'Centro de Apoio Jurídico',
    tipo: 'Assistência',
    distancia: '4.0km',
    descricao: 'Orientação jurídica gratuita para a população.',
    descricaoLonga: 'Nosso centro conta com advogados voluntários que oferecem atendimento em direito do trabalho, família, habitação e previdência social. Agendamento pelo telefone ou presencial.',
    horario: 'Seg–Sex: 9h às 17h',
    endereco: 'Rua Boa Vista, 170 – Centro, São Paulo',
    telefone: '(11) 3333-5555',
    gratuito: true,
    imagem: require('../assets/juridico.png'),
  },
  {
    id: '6',
    nome: 'Escola de Música Popular',
    tipo: 'Educação',
    distancia: '1.9km',
    descricao: 'Aulas de violão, flauta e percussão sem custo.',
    descricaoLonga: 'A Escola de Música Popular oferece aulas individuais e em grupo para crianças, jovens e adultos. Todos os instrumentos são fornecidos pela escola. As vagas são limitadas, garanta a sua!',
    horario: 'Ter, Qui e Sáb: 10h às 19h',
    endereco: 'Rua Vergueiro, 500 – Liberdade, São Paulo',
    telefone: '(11) 3333-6666',
    gratuito: true,
    imagem: require('../assets/musica.png'),
  },
  {
    id: '7',
    nome: 'Posto de Vacinação Comunitário',
    tipo: 'Saúde',
    distancia: '0.5km',
    descricao: 'Vacinação gratuita para todas as idades.',
    descricaoLonga: 'O Posto de Vacinação Comunitário aplica vacinas do calendário nacional gratuitamente, sem necessidade de agendamento. Leve um documento com foto e a caderneta de vacinação.',
    horario: 'Seg–Sex: 7h às 16h | Sáb: 8h às 12h',
    endereco: 'Av. Brigadeiro Faria Lima, 500 – Pinheiros, São Paulo',
    telefone: '(11) 3333-7777',
    gratuito: true,
    imagem: require('../assets/posto.png'),
  },
  {
    id: '8',
    nome: 'Casa de Acolhimento Família',
    tipo: 'Assistência',
    distancia: '5.2km',
    descricao: 'Apoio psicossocial a famílias em situação de risco.',
    descricaoLonga: 'A Casa de Acolhimento Família oferece atendimento psicológico, assistência social e encaminhamento para benefícios governamentais. Também realizamos oficinas de fortalecimento de vínculos familiares.',
    horario: 'Seg–Sex: 8h às 17h',
    endereco: 'Rua Tutóia, 350 – Paraíso, São Paulo',
    telefone: '(11) 3333-8888',
    gratuito: true,
    imagem: require('../assets/casa.png'),
  },
];

export default function Vitrine() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [servicoSelecionado, setServicoSelecionado] = useState<ServicoProps | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);

  const servicosFiltrados =
    categoriaAtiva === 'Todos'
      ? SERVICOS
      : SERVICOS.filter(s => s.tipo === categoriaAtiva);

  const abrirModal = (servico: ServicoProps) => {
    setServicoSelecionado(servico);
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setServicoSelecionado(null);
  };

  const renderItem = ({ item }: { item: ServicoProps }) => {
    const config = TIPO_CONFIG[item.tipo];
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => abrirModal(item)}>
        <View style={styles.imageWrapper}>
          <Image source={item.imagem} style={styles.image} resizeMode="cover" />
          <View style={styles.badgeDistancia}>
            <Ionicons name="location-outline" size={10} color="#fff" />
            <Text style={styles.badgeDistanciaText}>{item.distancia}</Text>
          </View>
          <View style={[styles.badgeTipo, { backgroundColor: config.cor }]}>
            <Ionicons name={config.icone as any} size={10} color="#fff" />
            <Text style={styles.badgeTipoText}>{item.tipo}</Text>
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.descricao}>{item.descricao}</Text>

          <View style={styles.footer}>
            <View style={[styles.tagGratis, { backgroundColor: config.bgLight }]}>
              <Ionicons name="checkmark-circle" size={12} color={config.cor} />
              <Text style={[styles.tagGratisText, { color: config.cor }]}>Gratuito</Text>
            </View>
            <TouchableOpacity style={[styles.btnVer, { backgroundColor: config.cor }]} onPress={() => abrirModal(item)}>
              <Text style={styles.btnVerText}>Ver detalhes</Text>
              <Ionicons name="arrow-forward" size={12} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Moveu o Header e os Filtros horizontais para um componente isolado do FlatList
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Próximos a você</Text>
        <Text style={styles.headerSub}>
          {servicosFiltrados.length} serviço{servicosFiltrados.length !== 1 ? 's' : ''} disponível{servicosFiltrados.length !== 1 ? 'is' : ''}
        </Text>
      </View>

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
                isAtivo && config ? { backgroundColor: config.cor, borderColor: config.cor } : {},
                isAtivo && !config ? styles.filtroAtivo : {},
              ]}
              onPress={() => setCategoriaAtiva(cat)}
            >
              {cat !== 'Todos' && config && (
                <Ionicons name={config.icone as any} size={13} color={isAtivo ? '#fff' : config.cor} style={{ marginRight: 4 }} />
              )}
              {cat === 'Todos' && (
                <Ionicons name="apps" size={13} color={isAtivo ? '#fff' : '#666'} style={{ marginRight: 4 }} />
              )}
              <Text style={[styles.filtroText, isAtivo && styles.filtroTextoAtivo]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={servicosFiltrados}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader} // Cabeçalho integrado de forma nativa ao scroll
        contentContainerStyle={{ paddingBottom: 24 }}
        style={styles.lista} 
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={styles.vazio}>Nenhum serviço nesta categoria.</Text>
          </View>
        }
      />

      {/* Modal de Detalhes */}
      <Modal animationType="slide" transparent={true} visible={modalVisivel} onRequestClose={fecharModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {servicoSelecionado && (
              <>
                <View style={styles.modalImageWrapper}>
                  <Image source={servicoSelecionado.imagem} style={styles.modalImage} resizeMode="cover" />
                  <TouchableOpacity style={styles.btnFechar} onPress={fecharModal}>
                    <Ionicons name="close" size={22} color="#fff" />
                  </TouchableOpacity>
                  <View style={[styles.modalBadgeTipo, { backgroundColor: TIPO_CONFIG[servicoSelecionado.tipo]?.cor }]}>
                    <Ionicons name={TIPO_CONFIG[servicoSelecionado.tipo]?.icone as any} size={12} color="#fff" />
                    <Text style={styles.modalBadgeTipoText}>{servicoSelecionado.tipo}</Text>
                  </View>
                </View>

                <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalTitulo}>{servicoSelecionado.nome}</Text>
                  <Text style={styles.modalDescLonga}>{servicoSelecionado.descricaoLonga}</Text>

                  <View style={styles.modalInfoGrid}>
                    {[
                      { icone: 'time-outline', label: 'Horário', valor: servicoSelecionado.horario },
                      { icone: 'location-outline', label: 'Endereço', valor: servicoSelecionado.endereco },
                      { icone: 'call-outline', label: 'Telefone', valor: servicoSelecionado.telefone },
                      { icone: 'walk-outline', label: 'Distância', valor: `${servicoSelecionado.distancia} de você` },
                    ].map((info) => (
                      <View key={info.label} style={styles.modalInfoItem}>
                        <View style={[styles.modalInfoIcon, { backgroundColor: TIPO_CONFIG[servicoSelecionado.tipo]?.bgLight }]}>
                          <Ionicons name={info.icone as any} size={18} color={TIPO_CONFIG[servicoSelecionado.tipo]?.cor} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.modalInfoLabel}>{info.label}</Text>
                          <Text style={styles.modalInfoValor}>{info.valor}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[styles.btnModalFechar, { backgroundColor: TIPO_CONFIG[servicoSelecionado.tipo]?.cor }]}
                    onPress={fecharModal}
                  >
                    <Text style={styles.btnModalFecharText}>Fechar</Text>
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  lista: { flex: 1 }, // Adicionado para esticar a FlatList por toda a tela
  headerContainer: { paddingBottom: 8 }, // Container unificado do topo
  header: { paddingHorizontal: 16, paddingTop: 16, marginBottom: 12 },
  headerTitulo: { fontSize: 24, fontWeight: '700', color: '#111' },
  headerSub: { fontSize: 13, color: '#888', marginTop: 2 },

  filtrosScroll: { marginBottom: 12, height: 44, flexGrow: 0, flexShrink: 0 },
  filtrosContent: { paddingHorizontal: 16, alignItems: 'center', gap: 8 },
  filtro: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 0.5,
    borderColor: '#ccc', backgroundColor: '#fff', elevation: 2,
  },
  filtroAtivo: { backgroundColor: '#1B5E20', borderColor: '#1B5E20' },
  filtroText: { fontSize: 13, color: '#666' },
  filtroTextoAtivo: { color: '#fff', fontWeight: '600' },

  card: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 16,
    marginHorizontal: 16,
    overflow: 'hidden', elevation: 4, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8,
  },
  imageWrapper: { position: 'relative' },
  image: { width: '100%', height: 160 },
  badgeDistancia: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 3,
  },
  badgeDistanciaText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  badgeTipo: {
    position: 'absolute', top: 10, left: 10,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 3,
  },
  badgeTipoText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  info: { padding: 14 },
  nome: { fontSize: 17, fontWeight: '700', color: '#111', marginBottom: 4 },
  descricao: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 12 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tagGratis: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  tagGratisText: { fontSize: 12, fontWeight: '600' },
  btnVer: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
  },
  btnVerText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  vazioContainer: { alignItems: 'center', paddingTop: 60 },
  vazio: { textAlign: 'center', color: '#999', fontSize: 14, marginTop: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: '#fff', borderTopLeftRadius: 24,
    borderTopRightRadius: 24, maxHeight: '90%', overflow: 'hidden',
  },
  modalImageWrapper: { position: 'relative' },
  modalImage: { width: '100%', height: 220 },
  btnFechar: {
    position: 'absolute', top: 14, right: 14,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 20, padding: 6,
  },
  modalBadgeTipo: {
    position: 'absolute', bottom: 14, left: 14,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  modalBadgeTipoText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  modalContent: { padding: 20 },
  modalTitulo: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 8 },
  modalDescLonga: { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 20 },
  modalInfoGrid: { gap: 14, marginBottom: 24 },
  modalInfoItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  modalInfoIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  modalInfoLabel: { fontSize: 11, color: '#999', fontWeight: '600', marginBottom: 2 },
  modalInfoValor: { fontSize: 14, color: '#222', fontWeight: '500', maxWidth: width - 100 },
  btnModalFechar: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  btnModalFecharText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});