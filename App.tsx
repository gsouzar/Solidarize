import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Vitrine from './telas/Vitrine';
import Perfil from './telas/Perfil';
import Mapa from './telas/Mapa';
import Notificacoes from './telas/Notificacoes';

const Tab = createBottomTabNavigator();

const VERDE = '#1B5E20';
const VERDE_CLARO = '#2E7D32';

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

            const icons: Record<string, [IoniconName, IoniconName]> = {
              Explorar:      ['search', 'search-outline'],
              Mapa:          ['map', 'map-outline'],
              Notificações:  ['notifications', 'notifications-outline'],
              Perfil:        ['person', 'person-outline'],
            };

            const [on, off] = icons[route.name] ?? ['help-circle', 'help-circle-outline'];
            return <Ionicons name={focused ? on : off} size={size} color={color} />;
          },

          tabBarActiveTintColor: VERDE,
          tabBarInactiveTintColor: '#9E9E9E',

          tabBarStyle: {
            height: 80,
            paddingBottom: 16,
            paddingTop: 8,
            borderTopWidth: 0.5,
            borderTopColor: '#E0E0E0',
            backgroundColor: '#fff',
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
          },

          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginTop: 3,
          },

          headerStyle: {
            backgroundColor: VERDE_CLARO,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen
          name="Explorar"
          component={Vitrine}
          options={{
            title: 'Serviços Sociais',
            headerRight: () => <NotifBell />,
          }}
        />
        <Tab.Screen
          name="Mapa"
          component={Mapa}
          options={{ title: 'Mapa' }}
        />
        <Tab.Screen
          name="Notificações"
          component={Notificacoes}
          options={{
            title: 'Notificações',
            tabBarBadge: 3,
            tabBarBadgeStyle: { fontSize: 10, minWidth: 16, height: 16 },
          }}
        />
        <Tab.Screen
          name="Perfil"
          component={Perfil}
          options={{ title: 'Meu Perfil' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function NotifBell() {
  return (
    <View style={{ marginRight: 16 }}>
      <Ionicons name="notifications-outline" size={22} color="#fff" />
      <View style={{
        position: 'absolute', top: -2, right: -4,
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: '#FF5722',
        borderWidth: 1.5, borderColor: VERDE_CLARO,
      }} />
    </View>
  );
}