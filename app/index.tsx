import { useSearch } from "@/hook/useSearch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import debounce from "lodash/debounce";
import List from "@/component/List";
import { styles } from "@/styles/styles"

export type ListType = {
  id: number,
  name: string,
  match: number,
  avatar: string,
  color: string,
  existing: boolean,
  type: string,
}

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
            <List data={searchResults} error={error} />
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


