import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const glossaryItems = [
  {
    question: 'What is the Aurora Borealis?',
    answer:
      'The Aurora Borealis, also known as the Northern Lights, is a natural light display predominantly seen in high-latitude regions.',
  },
  {
    question: 'What causes the Aurora?',
    answer:
      'Auroras are caused by the interaction of solar wind particles with the Earth’s magnetic field and atmosphere.',
  },
  {
    question: 'What is KP Index?',
    answer:
      'KP Index measures geomagnetic activity. Higher KP values increase the chances of visible auroras.',
  },
  {
    question: 'When is the best time to see an aurora?',
    answer:
      'The best time is during dark, clear nights with high solar activity, typically around midnight.',
  },
  {
    question: 'What is Bz?',
    answer:
      'Bz is the orientation of the interplanetary magnetic field. Negative Bz values increase aurora chances.',
  },
];

export default function GlossaryScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Aurora Glossary</Text>
      {glossaryItems.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text style={styles.question}>{item.question}</Text>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#000',   // <<--- THIS LINE
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
});