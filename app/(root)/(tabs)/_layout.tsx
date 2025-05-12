import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TabIconProps = {
  focused: boolean;
  name: React.ComponentProps<typeof Ionicons>['name'];
  isFirst?: boolean;
  isLast?: boolean;
};

const TabIcon = ({ focused, name, isFirst, isLast }: TabIconProps) => (
  <View style={styles.iconContainer}>
    <View
      style={[
        styles.iconBox,
        {
          backgroundColor: focused ? '#7fbcdd' : '#DDEDF2',
          borderColor: '#1779AE',
          borderLeftWidth: isFirst ? 0 : 3,
          borderRightWidth: isLast ? 0 : 3,
          borderBottomWidth: 0,
        },
      ]}
    >
      <Ionicons name={name} size={32} color={focused ? '#1779AE' : '#999999'} />
    </View>
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="calc"
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F0F0F0',
          height: 55,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name={focused ? 'desktop' : 'desktop-outline'}
              isFirst={true}
              isLast={false}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calc"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name={focused ? 'calculator' : 'calculator-outline'}
              isFirst={false}
              isLast={false}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name={focused ? 'person-circle' : 'person-circle-outline'}
              isFirst={false}
              isLast={true}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  iconBox: {
    width: 133,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 5,
  },
});
