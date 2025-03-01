import { useSearch } from "@/hook/useSearch";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import debounce from "lodash/debounce";

export type ListType = {
  id: number,
  name: string,
  match: number,
  avatar: string,
  color: string,
  existing: boolean,
  type: string
}

function Item({ item }: { item: ListType }) {
  return (
    <View style={styles.dropdown}>
      <Text style={styles.list}>{item.name}</Text>
    </View>
  )
}

export default function HomeScreen() {
  const [query, setQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [savedResults, setSavedResults] = useState<ListType[]>([])
  const [debounceQuery, setDebounceQuery] = useState<string>("");
  const { data: result, isLoading, error } = useSearch(debounceQuery);

  const unique = new Map()

  useEffect(() => {
    if (result?.autocomplete) {
      setSavedResults((prev: ListType[]) => {
        prev.forEach((item) => unique.set(item.id, item))
        result.autocomplete.forEach((item: ListType) => unique.set(item.id, item));
        return Array.from(unique.values());
      });
    }

  }, [result]);

  const searchResults = useMemo(() => {
    return savedResults.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, savedResults]);

  //In order to avoid to many request at each type. I call the api once the user stop typing for 600miliseconds
  const debounceSearch = useCallback(
    debounce((text) => setDebounceQuery(text), 600),
    []
  );


  useEffect(() => {
    debounceSearch(query);
    return () => debounceSearch.cancel()
  }, [query, debounceSearch])


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
      >

        {isFocused && (
          <View style={styles.dropdown}>
            {isLoading && (
              <ActivityIndicator size="large" color="grey" style={{
                paddingTop: 10, position: "absolute", top: 10,
                left: "50%",
                transform: [{ translateX: -12 }]
              }} />
            )}
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <Item item={item} />}
              style={styles.flat}
              inverted={true}
            />
          </View>
        )}
        <View style={styles.inputContainer}>

          <TextInput
            placeholder="Search Interests..."
            placeholderTextColor="#ffffff6a"
            value={query}
            style={styles.input}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 50
  },
  input: {
    height: 60,
    borderWidth: 2,
    padding: 10,
    width: "100%",
    borderRadius: 100,
    color: "white",
    borderColor: "#ffffffac"
    // backgroundColor: "#999999b"
  },
  inputContainer: {
    backgroundColor: "#1c1c1eab",
    width: "100%",
    padding: 10,
    height: "auto"
  },
  dropdown: {
    width: "100%",
    backgroundColor: "#999999b",
    color: "white",
    flex: 1,
  },
  scroll: {
    width: 20
  },
  flat: {
    borderWidth: 1,
    padding: 10,
    height: 40
  },
  list: {
    fontSize: 16,
    minHeight: "auto",
    alignSelf: "flex-start",
    height: 40
  }
})