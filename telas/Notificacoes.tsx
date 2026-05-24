import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Modal, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notificacao {
  id: string;
  icone: any;
  cor: string;
  corIcone: string;
  titulo: string;
  sub: string;
  detalhe: string;
  lida: boolean;
  tipo: 'sucesso' | 'conquista' | 'info' | 'alerta';
}

const NOTIFS: Notificacao[] = [
  {
    id: '1',
    icone: 'checkmark-circle',
    cor: '#E8F5E9', corIcone: '#1B5E20',
    titulo: 'Check-in confirmado!',
    sub: 'Cozinha Comunitária Sé · hoje, 12h',
    detalhe: 'Você realizou check-in na Cozinha Comunitária Sé hoje às 12h e ganhou 20 pontos. Continue assim para subir de nível!',
    lida: false,
    tipo: 'sucesso',
  },
  {
    id: '2',
    icone: 'trophy',
    cor: '#FFF8E1', corIcone: '#E65100',
    titulo: 'Você subiu para Membro Ouro 🏆',
    sub: '15 ações completadas · ontem',
    detalhe: 'Parabéns! Você completou 15 ações sociais e conquistou o nível Ouro. Agora você tem acesso a benefícios exclusivos nos locais parceiros.',
    lida: false,
    tipo: 'conquista',
  },
  {
    id: '3',
    icone: 'megaphone',
    cor: '#E3F2FD', corIcone: '#0D47A1',
    titulo: 'Novo serviço próximo a você',
    sub: 'Curso de Culinária · 2.1km',
    detalhe: 'Um novo Curso de Culinária Gratuito foi aberto a 2.1km de você. As vagas são limitadas, garanta a sua ainda hoje pelo nosso mapa!',
    lida: true,
    tipo: 'info',
  },
  {
    id: '4',
    icone: 'star',
    cor: '#FFF3E0', corIcone: '#E65100',
    titulo: 'Você ganhou 50 pontos bônus!',
    sub: 'Indicação de amigo · 2 dias atrás',
    detalhe: 'Um amigo se cadastrou usando o seu código de indicação. Como recompensa, você ganhou 50 pontos bônus no seu perfil!',
    lida: true,
    tipo: 'conquista',
  },
  {
    id: '5',
    icone: 'notifications',
    cor: '#F3E5F5', corIcone: '#6A1B9A',
    titulo: 'Lembrete: Consulta amanhã',
    sub: 'Clínica Popular Esperança · 10h',
    detalhe: 'Você tem uma consulta agendada amanhã às 10h na Clínica Popular Esperança. Lembre-se de levar um documento com foto.',
    lida: true,
    tipo: 'alerta',
  },
  {
    id: '6',
    icone: 'gift',
    cor: '#E8F5E9', corIcone: '#1B5E20',
    titulo: 'Novo parceiro adicionado',
    sub: 'Escola de Música Popular · 3 dias atrás',
    detalhe: 'A Escola de Música Popular agora é parceira do Solidarize! Você pode usar seu SOLIDARI-PASS para fazer check-in e acumular pontos.',
    lida: true,
    tipo: 'info',
  },
];

export default function Notificacoes() {
  const [notifs, setNotifs] = useState<Notificacao[]>(NOTIFS);
  const [notifSelecionada, setNotifSelecionada] = useState<Notificacao | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);

  const naoLidas = notifs.filter(n => !n.lida).length;

  const abrirNotificacao = (notif: Notificacao) => {
    setNotifSelecionada(notif);
    setModalVisivel(true);
    if (!notif.lida) {
      setNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, lida: true } : n));
    }
  };

  const marcarTodasLidas = () => {
    setNotifs(prev => prev.map(n => ({ ...n, lida: true })));
  };

  const renderItem = ({ item }: { item: Notificacao }) => (
    <TouchableOpacity
      style={[styles.card, !item.lida && styles.cardNaoLido]}
      onPress={() => abrirNotificacao(item)}
      activeOpacity={0.8}
    >
      {!item.lida && <View style={styles.dotNaoLido} />}
      <View style={[styles.iconBox, { backgroundColor: item.cor }]}>
        <Ionicons name={item.icone} size={22} color={item.corIcone} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.titulo, !item.lida && styles.tituloNaoLido]}>{item.titulo}</Text>
        <Text style={styles.sub}>{item.sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitulo}>Notificações</Text>
          {naoLidas > 0 && (
            <Text style={styles.headerSub}>{naoLidas} não lida{naoLidas > 1 ? 's' : ''}</Text>
          )}
        </View>
        {naoLidas > 0 && (
          <TouchableOpacity onPress={marcarTodasLidas}>
            <Text style={styles.btnMarcarLidas}>Marcar todas como lidas</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifs}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Ionicons name="notifications-off-outline" size={48} color="#ccc" />
            <Text style={styles.vazio}>Nenhuma notificação por enquanto.</Text>
          </View>
        }
      />

      {/* Modal de detalhe */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {notifSelecionada && (
              <>
                <View style={[styles.modalIconeBox, { backgroundColor: notifSelecionada.cor }]}>
                  <Ionicons name={notifSelecionada.icone} size={36} color={notifSelecionada.corIcone} />
                </View>
                <Text style={styles.modalTitulo}>{notifSelecionada.titulo}</Text>
                <Text style={styles.modalSub}>{notifSelecionada.sub}</Text>
                <View style={styles.separador} />
                <Text style={styles.modalDetalhe}>{notifSelecionada.detalhe}</Text>

                <TouchableOpacity
                  style={[styles.btnFechar, { backgroundColor: notifSelecionada.corIcone }]}
                  onPress={() => setModalVisivel(false)}
                >
                  <Text style={styles.btnFecharText}>Entendido</Text>
                </TouchableOpacity>
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
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    paddingTop: 16, paddingBottom: 4,
  },
  headerTitulo: { fontSize: 24, fontWeight: '700', color: '#111' },
  headerSub: { fontSize: 13, color: '#888', marginTop: 2 },
  btnMarcarLidas: { fontSize: 12, color: '#1B5E20', fontWeight: '600' },

  card: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
    elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
    position: 'relative',
  },
  cardNaoLido: {
    borderLeftWidth: 3, borderLeftColor: '#1B5E20',
    backgroundColor: '#FAFFF9',
  },
  dotNaoLido: {
    position: 'absolute', top: 12, right: 12,
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#1B5E20',
  },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  titulo: { fontSize: 14, fontWeight: '500', color: '#333' },
  tituloNaoLido: { fontWeight: '700', color: '#111' },
  sub: { fontSize: 12, color: '#888', marginTop: 2 },

  vazioContainer: { alignItems: 'center', paddingTop: 60 },
  vazio: { color: '#999', fontSize: 14, marginTop: 12 },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modalContainer: {
    backgroundColor: '#fff', borderRadius: 20,
    padding: 24, width: '100%', alignItems: 'center',
    elevation: 10,
  },
  modalIconeBox: {
    width: 72, height: 72, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  modalTitulo: { fontSize: 18, fontWeight: '700', color: '#111', textAlign: 'center', marginBottom: 4 },
  modalSub: { fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 16 },
  separador: { width: '100%', height: 1, backgroundColor: '#F0F0F0', marginBottom: 16 },
  modalDetalhe: { fontSize: 14, color: '#555', lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  btnFechar: {
    borderRadius: 12, paddingVertical: 13,
    paddingHorizontal: 32, alignItems: 'center', width: '100%',
  },
  btnFecharText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});