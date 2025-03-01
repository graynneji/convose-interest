import { ListType } from "@/app/index";
import { FlatList, Image, Text, View } from "react-native";
import { styles } from "@/styles/styles";
import { getRandomColor } from "@/utils";
import { memo } from "react";

interface ListProps {
    data: ListType[];
    error?: Error | null;
}

export const MemoItem = memo(function Item({ item }: { item: ListType }) {
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

export default function List({ data, error }: ListProps) {
    if (error) {
        return <View><Text style={styles.error}>Something went wrong</Text></View>
    }
    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MemoItem item={item} />}
            style={styles.flat}
            inverted={true}
        />
    )
}

