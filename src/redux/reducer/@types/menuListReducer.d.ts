type menuList = {
  menuList: menuListType[];
};

interface menuListType {
  title: string;
  createdAt: string;
  id: string;
  subSection?: menuServiceDetails[];
}

interface menuServiceDetails {
  createdAt?: string;
  id: string;
  serviceName: string;
  servicePrice: number | string;
  serviceDetails?: string;
}
