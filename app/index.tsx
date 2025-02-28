import { useSearch } from "@/hook/useSearch";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, FlatList, ScrollView } from "react-native";
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

  const [debounceQuery, setDebounceQuery] = useState<string>("");
  const { data: result } = useSearch(debounceQuery);


  //In order to avoid to many request at each type. We can the api once the user stop typing for 600miliseconds
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
      <View style={styles.container}>
        <TextInput
          placeholder="Search Interests..."
          value={query}
          style={styles.input}
          onChangeText={setQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {isFocused && (
          <View style={styles.dropdown}>
            <FlatList
              data={result?.autocomplete ?? []}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <Item item={item} />}
              style={styles.flat}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20
  },
  input: {
    height: 60,
    marginTop: 12,
    borderWidth: 1,
    padding: 10,
    width: "100%",
    // borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // borderColor: "white",
    color: "black",
    backgroundColor: "#999999b"
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