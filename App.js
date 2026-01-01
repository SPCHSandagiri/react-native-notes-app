import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from "react-native";

export default function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      if (storedNotes !== null) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.log("Error loading notes", error);
    }
  };

  const editNote = item => {
    setNote(item.text);
    setEditingId(item.id);
  };

  const addNote = () => {
    if (note.trim() === "") return;

    if (editingId) {
      const updatedNotes = notes.map(
        item => (item.id === editingId ? { ...item, text: note } : item)
      );

      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      setEditingId(null);
      setNote("");
      return;
    }

    const newNotes = [...notes, { id: Date.now().toString(), text: note }];

    setNotes(newNotes);
    saveNotes(newNotes);
    setNote("");
  };

  const saveNotes = async notesToSave => {
    try {
      await AsyncStorage.setItem("notes", JSON.stringify(notesToSave));
    } catch (error) {
      console.log("Error saving notes", error);
    }
  };

  const confirmDelete = id => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note Chamath?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteNote(id)
        }
      ]
    );
  };

  const deleteNote = id => {
    const newNotes = notes.filter(item => item.id !== id);
    setNotes(newNotes);
    saveNotes(newNotes);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Notes</Text>

      <TextInput
        style={styles.input}
        placeholder="Type a note..."
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.button} onPress={addNote}>
        <Text style={styles.buttonText}>
          {editingId ? "Update Note" : "Add Note"}
        </Text>
      </TouchableOpacity>

      {/* <Pressable style={styles.button} onPress={addNote}>
        <Text style={styles.buttonText}>Add Note</Text>
      </Pressable> */}

      {/* {notes.map((item, index) =>
        <View key={index} style={styles.noteCard}>
          <Text style={styles.noteTitle}>
            {item.title}
          </Text>
          <Text>
            {item.note}
          </Text>
        </View>
      )} */}

      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) =>
          <View style={styles.noteItem}>
            <TouchableOpacity onPress={() => editNote(item)}>
              <Text>
                {item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(item.id)}>
              <Text style={styles.delete}>❌</Text>
            </TouchableOpacity>
          </View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 5,
    marginVertical: 10
  },
  buttonText: {
    color: "#fff",
    textAlign: "center"
  },
  noteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#eee",
    marginVertical: 5,
    borderRadius: 5
  },
  delete: {
    color: "red"
  }
});
