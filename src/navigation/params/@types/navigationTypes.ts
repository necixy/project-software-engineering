import {
  CompositeNavigationProp,
  CompositeScreenProps,
  RouteProp,
} from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { rootStackParams } from "../rootStackParams";
import { authStackParam } from "../AuthStackParam";
import { screenStackName } from "src/navigation/constant/screenStackName";
import { screenStackParams } from "../screenStackParams";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { rootStackName } from "src/navigation/constant/rootStackName";

export type RootRouteProps<RouteName extends keyof rootStackParams> = RouteProp<
  rootStackParams,
  RouteName
>;

export type RootScreenProps<RouteName extends keyof rootStackParams> =
  NativeStackScreenProps<rootStackParams, RouteName>;
export type AuthScreenProps<RouteName extends keyof authStackParam> =
  NativeStackScreenProps<authStackParam, RouteName>;
export type RootUseNavigationProps = NativeStackNavigationProp<rootStackParams>;
export type AuthUseNavigationProps = NativeStackNavigationProp<authStackParam>;

// export type ScreenStackProps<RouteName extends keyof screenStackName> =
//   NativeStackScreenProps<rootStackParams, RouteName>;

export type ScreenStackRouteProps<RouteName extends keyof screenStackParams> =
  CompositeScreenProps<
    StackScreenProps<screenStackParams, RouteName>,
    StackScreenProps<rootStackParams>
  >;

export type ScreenStackNavigationProp<
  RouteName extends keyof screenStackParams,
> = CompositeNavigationProp<
  StackNavigationProp<screenStackParams, RouteName>,
  StackNavigationProp<rootStackParams>
>;

export type RootStackScreenProps<T extends keyof rootStackParams> =
  StackScreenProps<rootStackParams, T>;

export type HomeTabScreenProps<T extends keyof screenStackParams> =
  CompositeScreenProps<
    StackScreenProps<screenStackParams, T>,
    RootStackScreenProps<keyof rootStackParams>
  >;
