type ProfileFormValues = {
  name: string;
  email: string;
  image: string;
};

type ProfileFormState = {
  success: boolean;
  message: string;
  resultId?: string;
  values: ProfileFormValues;
  errors?: {
    name?: string;
    avatar?: string;
  };
};
