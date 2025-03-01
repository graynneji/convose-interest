import { useSearch } from "@/hook/useSearch";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Text, Image, View, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import debounce from "lodash/debounce";
import { getRandomColor } from "@/utils";

export type ListType = {
  id: number,
  name: string,
  match: number,
  avatar: string,
  color: string,
  existing: boolean,
  type: string
}

const MemoItem = memo(function Item({ item }: { item: ListType }) {
  const letterImage = item.name.split("")
  const backgroundColor = getRandomColor()
  return (

    <View style={{ alignItems: "center", flexDirection: "row", marginBottom: 20, gap: 10 }}>

      {item.avatar ? (<Image
        source={{ uri: `${item.avatar}` }}
        style={{ width: 40, height: 40 }}
      />) : (
        <View style={{ width: 40, height: 40, backgroundColor, borderRadius: 40 / 2, justifyContent: "center" }}>
          <Text style={styles.imagePic}>{letterImage[0]}</Text>
        </View>
      )}
      <Text style={styles.list}>{item.name}</Text>
    </View>

  )
})

export default function HomeScreen() {
  const [query, setQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [savedResults, setSavedResults] = useState<ListType[]>([])
  const [debounceQuery, setDebounceQuery] = useState<string>("");
  const { data: result, isLoading, error } = useSearch(debounceQuery);

  // I created a new instance of a Map to make unique when the api fetches new data it duplicates if there are exixting properties
  const unique = new Map()

  //I created a useEffect to update the state and new data is added to the prev when result changes. I used the id as key to remove duplicates
  useEffect(() => {
    if (result?.autocomplete) {
      setSavedResults((prev: ListType[]) => {
        //I added the old data in the Map
        prev.forEach((item) => unique.set(item.id, item))
        //I updated new data into the set this helps keep it unique removing duplicates
        result.autocomplete.forEach((item: ListType) => unique.set(item.id, item));
        //then i retruned the values of the Map and converted it to an araay 
        return Array.from(unique.values());
      });
    }

  }, [result]);

  //I handled the search and filters here 
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

  //I set the query into the debounce
  useEffect(() => {
    debounceSearch(query);
    return () => debounceSearch.cancel()
  }, [query, debounceSearch])


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* i used this to enables the search view stay on top of the keyboard */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
      >

        {isFocused && (
          <View style={styles.dropdown}>
            {isLoading && (
              <ActivityIndicator size="large" color="white" style={{
                paddingTop: 10, position: "absolute", top: 10,
                left: "50%",
                transform: [{ translateX: -12 }]
              }} />
            )}
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <MemoItem item={item} />}
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
    marginBottom: 50,

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
    backgroundColor: "#1c1c1e",
    width: "100%",
    padding: 10,
    height: "auto"
  },
  dropdown: {
    width: "100%",
    backgroundColor: "#1c1c1e",
    color: "white",
    flex: 1,
    justifyContent: "center",
  },
  flat: {
    borderWidth: 1,
    padding: 10,
    height: 40,
  },
  list: {
    fontSize: 16,
    minHeight: "auto",
    alignSelf: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 200,
  },
  imagePic: {
    color: "white",
    alignSelf: "center",

  }
})