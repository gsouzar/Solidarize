import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Modal, Alert, SafeAreaView, Image
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER = {
  nome: 'Gustavo de Souza',
  id: 'GSZ-2024-001',
  nivel: 'Ouro',
  acoes: 15,
  parceiros: 8,
  pontos: 320,
  email: 'gustavo.souza@email.com',
  cidade: 'São Paulo – SP',
};

const HISTORICO = [
  { id: '1', acao: 'Check-in: Cozinha Comunitária Sé', data: 'Hoje, 12h', pontos: +20, icone: 'restaurant' },
  { id: '2', acao: 'Check-in: Curso de Informática', data: 'Ontem, 15h', pontos: +15, icone: 'school' },
  { id: '3', acao: 'Check-in: Clínica Popular Esperança', data: '3 dias atrás', pontos: +25, icone: 'medkit' },
  { id: '4', acao: 'Cadastro realizado', data: '1 semana atrás', pontos: +10, icone: 'person-add' },
];

export default function Perfil() {
  const [modalCameraVisivel, setModalCameraVisivel] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  
  // Estado que armazena a foto carregada/tirada
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  
  // Referência para controlar a ação de disparo da câmera
  const cameraRef = useRef<CameraView>(null);

  const qrValue = `SOLIDARI-PASS::${USER.id}::${USER.nome.replace(/ /g, '_').toUpperCase()}`;

  // BUSCA A FOTO GRAVADA NO CELULAR LOGO QUANDO O APP ABRE
  useEffect(() => {
    const carregarFotoSalva = async () => {
      try {
        const fotoSalva = await AsyncStorage.getItem('@foto_perfil');
        if (fotoSalva !== null) {
          setFotoPerfil(fotoSalva);
        }
      } catch (error) {
        console.log("Erro ao carregar a foto do armazenamento:", error);
      }
    };

    carregarFotoSalva();
  }, []);

  const abrirCamera = async () => {
    if (!permission) {
      await requestPermission();
      return;
    }
    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de acesso à câmera para você atualizar sua foto de perfil.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    setModalCameraVisivel(true);
  };

  const toggleCamera = () => {
    setCameraFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // CAPTURA A FOTO E GRAVA NO ARMAZENAMENTO INTERNO
  const tirarFoto = async () => {
    if (cameraRef.current) {
      try {
        const opcoes = { quality: 0.5, skipProcessing: true };
        const foto = await cameraRef.current.takePictureAsync(opcoes);
        
        if (foto && foto.uri) {
          setFotoPerfil(foto.uri); // Coloca a foto na tela na hora
          
          // Grava a foto permanentemente no celular para não sumir ao fechar
          await AsyncStorage.setItem('@foto_perfil', foto.uri); 
          
          setModalCameraVisivel(false); // Fecha a câmera
          Alert.alert('Sucesso!', 'Sua foto de perfil foi salva com sucesso.');
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível capturar a foto. Tente novamente.');
        console.log(error);
      }
    }
  };

  const nivelCor: Record<string, string> = {
    Ouro: '#F59E0B',
    Prata: '#94A3B8',
    Bronze: '#B45309',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Avatar e info */}
        <View style={styles.userSection}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={abrirCamera} activeOpacity={0.85}>
            <View style={styles.avatar}>
              {fotoPerfil ? (
                <Image source={{ uri: fotoPerfil }} style={styles.avatarImagem} />
              ) : (
                <Text style={styles.avatarText}>GS</Text>
              )}
            </View>
            <View style={styles.avatarCameraBtn}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>{USER.nome}</Text>
          <Text style={styles.userEmail}>{USER.email}</Text>
          <Text style={styles.userCidade}>
            <Ionicons name="location-outline" size={12} color="#888" /> {USER.cidade}
          </Text>

          <View style={styles.badges}>
            <View style={[styles.badgeNivel, { backgroundColor: nivelCor[USER.nivel] + '22' }]}>
              <Ionicons name="trophy" size={13} color={nivelCor[USER.nivel]} />
              <Text style={[styles.badgeNivelText, { color: nivelCor[USER.nivel] }]}>Membro {USER.nivel}</Text>
            </View>
            <View style={styles.badgeAtivo}>
              <View style={styles.dotAtivo} />
              <Text style={styles.badgeAtivoText}>Ativo</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Ações', valor: USER.acoes, icone: 'flash', cor: '#E65100' },
            { label: 'Parceiros', valor: USER.parceiros, icone: 'people', cor: '#0D47A1' },
            { label: 'Pontos', valor: USER.pontos, icone: 'star', cor: '#F59E0B' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Ionicons name={stat.icone as any} size={20} color={stat.cor} />
              <Text style={styles.statValor}>{stat.valor}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Card do SOLIDARI-PASS */}
        <View style={styles.passCard}>
          <View style={styles.passHeader}>
            <View>
              <Text style={styles.passLabel}>SOLIDARI-PASS</Text>
              <Text style={styles.passName}>{USER.nome}</Text>
              <Text style={styles.passId}>ID: #{USER.id}</Text>
            </View>
            <View style={[styles.passNivelBadge, { backgroundColor: nivelCor[USER.nivel] }]}>
              <Ionicons name="trophy" size={14} color="#fff" />
              <Text style={styles.passNivelText}>{USER.nivel}</Text>
            </View>
          </View>

          <View style={styles.qrWrapper}>
            <QRCode
              value={qrValue}
              size={140}
              color="#1B5E20"
              backgroundColor="#ffffff"
            />
          </View>

          <Text style={styles.footerText}>
            Apresente este QR Code nos locais parceiros para acumular pontos
          </Text>
        </View>

        {/* Histórico */}
        <View style={styles.historicoSection}>
          <Text style={styles.historicoTitulo}>Histórico de Ações</Text>
          {HISTORICO.map((item) => (
            <View key={item.id} style={styles.historicoItem}>
              <View style={styles.historicoIcone}>
                <Ionicons name={item.icone as any} size={18} color="#1B5E20" />
              </View>
              <View style={styles.historicoInfo}>
                <Text style={styles.historicoAcao}>{item.acao}</Text>
                <Text style={styles.historicoData}>{item.data}</Text>
              </View>
              <View style={styles.historicoPontos}>
                <Text style={styles.historicoPontosText}>+{item.pontos}</Text>
                <Text style={styles.historicoPtLabel}>pts</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Botão editar perfil */}
        <TouchableOpacity style={styles.btnEditar} onPress={abrirCamera}>
          <Ionicons name="camera-outline" size={18} color="#1B5E20" />
          <Text style={styles.btnEditarText}>Atualizar foto de perfil</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal Câmera */}
      <Modal
        animationType="slide"
        visible={modalCameraVisivel}
        onRequestClose={() => setModalCameraVisivel(false)}
      >
        <View style={styles.cameraContainer}>
          {permission?.granted ? (
            <>
              <CameraView style={styles.camera} facing={cameraFacing} ref={cameraRef}>
                <View style={styles.cameraOverlay}>
                  {/* Botão fechar */}
                  <TouchableOpacity
                    style={styles.cameraFechar}
                    onPress={() => setModalCameraVisivel(false)}
                  >
                    <Ionicons name="close" size={28} color="#fff" />
                  </TouchableOpacity>

                  <Text style={styles.cameraInstrucao}>Posicione seu rosto no centro</Text>

                  {/* Guia oval */}
                  <View style={styles.cameraGuia} />

                  {/* Controles */}
                  <View style={styles.cameraControles}>
                    <TouchableOpacity style={styles.cameraIconBtn} onPress={toggleCamera}>
                      <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cameraBtnFoto} onPress={tirarFoto}>
                      <View style={styles.cameraBtnFotoInner} />
                    </TouchableOpacity>

                    <View style={{ width: 52 }} />
                  </View>
                </View>
              </CameraView>
            </>
          ) : (
            <View style={styles.permissaoContainer}>
              <Ionicons name="camera-outline" size={64} color="#ccc" />
              <Text style={styles.permissaoTitulo}>Acesso à câmera</Text>
              <Text style={styles.permissaoSub}>
                Precisamos da sua permissão para acessar a câmera e atualizar sua foto de perfil.
              </Text>
              <TouchableOpacity style={styles.permissaoBtn} onPress={requestPermission}>
                <Text style={styles.permissaoBtnText}>Permitir acesso</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalCameraVisivel(false)}>
                <Text style={styles.permissaoCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F5' },
  container: { alignItems: 'center', padding: 20, paddingBottom: 40 },
  userSection: { alignItems: 'center', marginBottom: 20, gap: 6, width: '100%' },
  avatarWrapper: { position: 'relative', marginBottom: 4 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#DBEAFE',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#1B5E20',
    overflow: 'hidden',
  },
  avatarText: { fontSize: 30, fontWeight: '700', color: '#1D4ED8' },
  avatarImagem: { width: '100%', height: '100%', resizeMode: 'cover' },
  avatarCameraBtn: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#1B5E20', borderRadius: 14,
    width: 28, height: 28, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
    zIndex: 10,
  },
  userName: { fontSize: 22, fontWeight: '700', color: '#111' },
  userEmail: { fontSize: 13, color: '#888' },
  userCidade: { fontSize: 13, color: '#888' },
  badges: { flexDirection: 'row', gap: 8, marginTop: 6 },
  badgeNivel: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20,
  },
  badgeNivelText: { fontSize: 12, fontWeight: '700' },
  badgeAtivo: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#DCFCE7', paddingHorizontal: 12,
    paddingVertical: 4, borderRadius: 20,
  },
  dotAtivo: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#166534' },
  badgeAtivoText: { fontSize: 12, fontWeight: '600', color: '#166534' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20, width: '100%' },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14,
    padding: 14, alignItems: 'center', gap: 4, elevation: 2,
  },
  statValor: { fontSize: 22, fontWeight: '700', color: '#111' },
  statLabel: { fontSize: 11, color: '#888' },
  passCard: {
    width: '100%', backgroundColor: '#1B5E20',
    borderRadius: 20, padding: 22, alignItems: 'center',
    elevation: 8, marginBottom: 20, gap: 6,
  },
  passHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  passLabel: { color: '#ffffff99', fontSize: 10, letterSpacing: 3, fontWeight: '600' },
  passName: { color: '#A5D6A7', fontSize: 18, fontWeight: '700' },
  passId: { color: '#ffffff66', fontSize: 11 },
  passNivelBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  passNivelText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  qrWrapper: { backgroundColor: '#fff', borderRadius: 14, padding: 14 },
  footerText: { color: '#ffffff99', fontSize: 11, textAlign: 'center', marginTop: 8 },
  historicoSection: { width: '100%', marginBottom: 16 },
  historicoTitulo: { fontSize: 17, fontWeight: '700', color: '#111', marginBottom: 12 },
  historicoItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 8, elevation: 1,
  },
  historicoIcone: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center',
  },
  historicoInfo: { flex: 1 },
  historicoAcao: { fontSize: 13, fontWeight: '600', color: '#111' },
  historicoData: { fontSize: 11, color: '#888', marginTop: 2 },
  historicoPontos: { alignItems: 'center' },
  historicoPontosText: { fontSize: 16, fontWeight: '700', color: '#1B5E20' },
  historicoPtLabel: { fontSize: 10, color: '#888' },
  btnEditar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderColor: '#1B5E20', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 24, width: '100%', justifyContent: 'center',
  },
  btnEditarText: { color: '#1B5E20', fontSize: 14, fontWeight: '600' },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  cameraOverlay: {
    flex: 1, alignItems: 'center',
    justifyContent: 'space-between', padding: 20, paddingBottom: 40,
  },
  cameraFechar: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 6,
  },
  cameraInstrucao: { color: '#fff', fontSize: 14, fontWeight: '500', textAlign: 'center' },
  cameraGuia: {
    width: 220, height: 280, borderRadius: 110,
    borderWidth: 2, borderColor: '#fff',
    borderStyle: 'dashed',
  },
  cameraControles: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', width: '80%',
  },
  cameraIconBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  cameraBtnFoto: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    elevation: 4,
  },
  cameraBtnFotoInner: {
    width: 58, height: 58, borderRadius: 29,
    borderWidth: 3, borderColor: '#1B5E20',
  },
  permissaoContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 32, backgroundColor: '#fff',
  },
  permissaoTitulo: { fontSize: 22, fontWeight: '700', color: '#111', marginTop: 16, marginBottom: 8 },
  permissaoSub: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  permissaoBtn: {
    backgroundColor: '#1B5E20', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 32,
  },
  permissaoBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  permissaoCancelar: { color: '#888', fontSize: 14, marginTop: 16 },
});