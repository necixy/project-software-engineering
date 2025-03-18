type menuList = {
  menuList: menuListType[];
};

interface tempMenu {
  id: string | null;
  title: string | null;
}

interface menuListType {
  id?: string;
  createdAt?: string;
  title: string;
  subSection?: menuServiceDetails[];
}

interface menuServiceDetails {
  id?: string;
  serviceName: string;
  servicePrice: number | string;
  subServiceDetails?: string;
}

interface menuFormType {
  title: string | null;
  id: string | null;
  serviceName?: string | null;
  servicePrice?: string | null;
  serviceDetails?: string | null;
}
