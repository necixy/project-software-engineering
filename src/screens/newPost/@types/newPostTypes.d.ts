// this screen declares types for every data being used in the new post and share post screen.
import { Dispatch, SetStateAction } from "react";
import { PhotoIdentifier, Album } from '@react-native-camera-roll/camera-roll/src/CameraRoll';

export interface image {
    filename: string | null;
    filepath: string | null;
    extension: string | null;
    uri: string;
    height: number;
    width: number;
    fileSize: number | null;
    playableDuration: number;
    orientation: number | null;
  };
export interface TRoute {
    key: string;
    name: string;
    params: {selected:PhotoIdentifier[],setSelected:Dispatch<SetStateAction<PhotoIdentifier[]>>,images:PhotoIdentifier[]};
    path: undefined;
  }
export interface THeaderProps {
  selected?: PhotoIdentifier[];
  hasCancel?: boolean;
  back?: boolean;
  setSelected?: Dispatch<SetStateAction<PhotoIdentifier[]>>;
  images?:PhotoIdentifier[];
  hasNext?:boolean;
}
export interface TCustomImageSelectorHeaderProps {
  album:Album[] | undefined;
  selectedAlbum:Album | undefined;
  handleAlbumChange: (item: Album) => void;
  hasPermission?:boolean;
}
interface TMedia {
  node: {
      group_name: never[];
      id: string;
      image: {
          extension: null;
          fileSize: null;
          filename: null;
          height: null;
          orientation: null;
          playableDuration: number;
          uri: string;
          width: null;
      };
      location: null;
      type: string;
  };
}