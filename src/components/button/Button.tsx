import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";
 
type Props = IButtonProps &  {
    title: string;
    color?: string;
    w?: string
}
export function Button({title, color = "green.700", ...res}: Props){
    return(
        <ButtonNativeBase
            w="full"
            h={20}
            mb={8}
            bg={color}
            _pressed={{
                bgColor:"green.900"
            }}
            {...res}
        >
        <Text color= "white" fontSize={26}>{title}</Text>
 
        </ButtonNativeBase>
    )
}