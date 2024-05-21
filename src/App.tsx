import { useEffect, useState } from 'react';
import { z } from 'zod';
import supabase from './SupabaseClient';

import {
  FormBody,
  FormContent,
  FormixFormProvider,
  FormDescription,
  FormFlexFields,
  FormFooter,
  FormHeader,
  FormTitle,
  ISchemaFormProps,
  ThemeProvider,
} from '@adimis/react-formix';
import '@adimis/react-formix/dist/style.css';
import { v4 as uuidV4 } from 'uuid';

interface SignUp {
  id?: number;
  username: string;
  email: string;
  address: string;
  phone: string;
  password: string;
  file: File[];
  gender: string;
  terms: boolean;
  date: Date;
  year: number;
  expertise: string;
  profilePictureUrl?: string;
}
interface userInfoProps {
  id?: number;
  username?: string;
  email?: string;
  address?: string;
  phone?: string;
  password?: string;
  file?: string;
  gender?: string;
  terms?: boolean;
  date?: Date;
  year?: number;
  expertise?: string;
  profilePictureUrl?: string;
}

const App = () => {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<userInfoProps>({
    id: 0,
    username: '',
    email: '',
    address: '',
    phone: '',
    password: '',
    file: '',
    date: undefined,
    year: 0,
    expertise: '',
    gender: '',
    terms: false,
  });
  const storedData = localStorage.getItem('adimis-schema-form-user-registration-form');
  useEffect(() => {
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserInfo({
          id: Number(parsedData?.id) ?? undefined,
          username: parsedData?.username ?? '',
          email: parsedData?.email ?? '',
          address: parsedData?.address ?? '',
          phone: parsedData?.phone ?? '',
          password: parsedData?.password ?? '',
          file: parsedData?.profilePicture ?? '',
          date: new Date(parsedData?.date ?? ""),
          year: Number(parsedData?.year) ?? undefined,
          expertise: parsedData?.expertise ?? [],
          gender: parsedData?.gender ?? '',
          terms: parsedData?.terms ?? false,
        });
        setProfilePictureUrl(parsedData?.profilePicture ?? '');
        const fetchUserInfo = async () => {
          if (Number(parsedData.id) == 0) return;
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', Number(parsedData.id));

          if (error) {
            return;
          }
          if (data && data.length > 0) {
            setUserInfo(data[0]);
            setProfilePictureUrl(data[0].file);
          }
        };
        fetchUserInfo();
      } catch (e) {
        console.error('Error parsing local storage data:', e);
      }
    }
  }, [
    storedData
  ]);
  const uploadFileToSupabase = async (file: File) => {
    const storedData = localStorage.getItem('adimis-schema-form-user-registration-form') ?? "{}";
    const parsedData = JSON.parse(storedData);
    const { data, error } = await supabase.storage
      .from('profile-pictures')
      .upload('public/' + uuidV4(), file);

    if (error || !localStorage.getItem('adimis-schema-form-user-registration-form')) {
      return null;
    }
    const userFileUpload = await supabase.storage.from('profile-pictures').getPublicUrl(data.path).data.publicUrl
    localStorage.setItem('adimis-schema-form-user-registration-form', JSON.stringify({
      ...parsedData,
      profilePicture: userFileUpload
    }));
    setProfilePictureUrl(userFileUpload);
    return userFileUpload;
  };

  const schemaFormProps: ISchemaFormProps<SignUp> = {
    formLabel: 'User Registration Form',
    formSlug: 'user-registration-form',
    persistFormResponse: 'localStorage',
    devTools: true,
    formDisabled: false,
    enableConditionalRendering: true,
    schema: [
      {
        key: 'id',
        type: 'hidden',
        defaultValue: Number(userInfo.id) ?? 0,
        render: ({ formDisabled, formItem, formMethods, submitButtonLoading }) => (
          <input
            type={formItem.type}
            id={formItem.key}
            disabled={formDisabled || submitButtonLoading}
            style={{
              display: 'none',
            }}
            min={0}
            {...formMethods.register(formItem.key)}
          />
        ),
      },
      {
        key: 'username',
        label: 'Username',
        description: 'Enter your desired username.',
        autoComplete: 'username',
        type: 'text',
        placeholder: 'Your username',
        defaultValue: userInfo.username || '',
        validations: z
          .string()
          .min(1, 'Username is required')
          .max(20, 'Username must not exceed 20 characters'),
        render: ({ formDisabled, formItem, formMethods, submitButtonLoading }) => (
          <input
            type={formItem.type}
            id={formItem.key}
            disabled={formDisabled || submitButtonLoading}
            style={{
              width: '100%',
              height: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              margin: '5px 0',
              color: 'black',
            }}
            {...formMethods.register(formItem.key)}
          />
        ),
      },
      {
        key: 'email',
        label: 'Email',
        description: 'Enter your email address.',
        autoComplete: 'email',
        type: 'email',
        placeholder: 'Your email',
        defaultValue: userInfo.email || '',
        validations: z
          .string()
          .email('Enter a valid email address')
          .min(1, 'Email is required'),
        render: ({ formDisabled, formItem, formMethods, submitButtonLoading }) => (
          <input
            type={formItem.type}
            id={formItem.key}
            disabled={formDisabled || submitButtonLoading}
            style={{
              width: '100%',
              height: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              color: 'black',
            }}
            {...formMethods.register(formItem.key)}
          />
        ),
      },
      {
        key: 'address',
        label: 'Address',
        description: 'Enter your full address.',
        autoComplete: 'address-line1',
        type: 'text',
        placeholder: 'Your address',
        defaultValue: userInfo.address || '',
        validations: z
          .string()
          .min(10, 'Address should be at least 10 characters'),
        render: ({ formDisabled, formItem, formMethods, submitButtonLoading }) => (
          <input
            type={formItem.type}
            id={formItem.key}
            disabled={formDisabled || submitButtonLoading}
            style={{
              width: '100%',
              height: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              color: 'black',
            }}
            {...formMethods.register(formItem.key)}
          />
        ),
      },
      {
        key: 'phone',
        label: 'Phone',
        description: 'Enter your phone number with country code.',
        autoComplete: 'tel',
        type: 'tel',
        placeholder: '+1234567890',
        defaultValue: userInfo.phone || '',
        validations: z
          .string()
          .regex(/^\+?(\d.*){10,}$/, 'Enter a valid phone number'),
        render: ({ formDisabled, formItem, formMethods, submitButtonLoading }) => (
          <input
            type={formItem.type}
            id={formItem.key}
            disabled={formDisabled || submitButtonLoading}
            style={{
              width: '100%',
              height: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              color: 'black',
            }}
            {...formMethods.register(formItem.key)}
          />
        ),
      },
      {
        key: 'password',
        label: 'Password',
        description: 'Enter a strong password.',
        autoComplete: 'new-password',
        type: 'password',
        placeholder: 'Your password',
        defaultValue: userInfo.password || '',
        validations: z
          .string()
          .min(8, 'Password should be at least 8 characters')
          .max(20, 'Password must not exceed 20 characters'),
        displayConditions: [
          {
            dependentField: 'email',
            dependentFieldValue: 'admin@adimis.in',
            operator: '===',
          },
        ],
        removeValidationConditions: [
          {
            dependentField: 'email',
            dependentFieldValue: 'admin@adimis.in',
            operator: '!==',
          },
        ],
        render: ({ formDisabled, formItem, formMethods, submitButtonLoading }) => (
          <input
            type={formItem.type}
            id={formItem.key}
            disabled={formDisabled || submitButtonLoading}
            style={{
              width: '100%',
              height: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              color: 'black',
            }}
            {...formMethods.register(formItem.key)}
          />
        ),
      },
      {
        key: 'file',
        label: 'Profile Picture',
        description: 'Upload your profile picture.',
        type: 'file',
        placeholder: 'Upload file',
        defaultValue: '',
        validations: z.any(),
        render: ({ formDisabled, formItem, formMethods, submitButtonLoading }) => (
          <>
            <input
              type="file"
              id={formItem.key}
              disabled={formDisabled || submitButtonLoading}
              style={{
                width: '100%',
                height: 'auto',
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                color: 'white',
              }}
              accept='image/*'
              {...formMethods.register(formItem.key)}
              onChange={(e) => {
                // if (e.target.files?.[0])
                return uploadFileToSupabase(e.target.files?.[0] ?? new File([], ''));
              }}
            />
            {profilePictureUrl && (
              <div style={{ marginTop: '20px' }}>
                <h3>Profile Picture:</h3>
                <img src={profilePictureUrl} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '10%' }} />
              </div>
            )}
          </>
        ),
      },
      {
        key: 'date',
        label: 'Date',
        description: 'Enter the date.',
        type: 'date',
        placeholder: 'Enter date',
        defaultValue: new Date(userInfo?.date?.toString().split('T')[0] ?? ""),
        validations: z.any(),
        render: ({ formDisabled, formItem, formMethods, submitButtonLoading }) => (
          <input
            type="date"
            id={formItem.key}
            disabled={formDisabled || submitButtonLoading}
            style={{
              width: '100%',
              height: 'auto',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              color: 'black',
            }}
            {...formMethods.register(formItem.key)}
          />
        ),
      },
      {
        key: 'year',
        label: 'Year',
        description: 'Enter the year.',
        type: 'number',
        placeholder: 'Enter year',
        defaultValue: userInfo.year ?? 0,
        validations: z.any(),
        render: ({ formDisabled, formItem, formMethods, submitButtonLoading }) => (
          <input
            type="number"
            id={formItem.key}
            disabled={formDisabled || submitButtonLoading}
            style={{
              width: '100%',
              height: 'auto',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              color: 'black',
            }}
            {...formMethods.register(formItem.key)}
          />
        ),
      },
      {
        key: 'expertise',
        label: 'Expertise',
        description: 'Enter your expertise.',
        type: 'text',
        placeholder: 'Enter expertise',
        defaultValue: userInfo.expertise ?? '',
        validations: z.string(),
        render: ({ formDisabled, formItem, formMethods, submitButtonLoading }) => (
          <input
            type="text"
            id={formItem.key}
            disabled={formDisabled || submitButtonLoading}
            style={{
              width: '100%',
              height: 'auto',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              color: 'black',
            }}
            {...formMethods.register(formItem.key)}
          />
        ),
      },
      {
        key: 'gender',
        label: 'Gender',
        description: 'Enter your gender.',
        type: 'text',
        placeholder: 'Enter gender',
        defaultValue: userInfo.gender ?? '',
        validations: z.string(),
        render: ({ formDisabled, formItem, formMethods, submitButtonLoading }) => (
          <input
            type="text"
            id={formItem.key}
            disabled={formDisabled || submitButtonLoading}
            style={{
              width: '100%',
              height: 'auto',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              color: 'black',
            }}
            {...formMethods.register(formItem.key)}
          />
        ),
      },
      {
        key: 'terms',
        label: 'Terms',
        description: 'Accept the terms and conditions.',
        type: 'checkbox',
        defaultValue: userInfo.terms ?? false,
        validations: z.boolean(),
        render: ({ formDisabled, formItem, formMethods, submitButtonLoading }) => (
          <input
            type="checkbox"
            id={formItem.key}
            disabled={formDisabled || submitButtonLoading}
            style={{
              width: 'auto',
              height: 'auto',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              color: 'black',
            }}
            {...formMethods.register(formItem.key)}
          />
        ),
      },
    ],
    defaultValues: {
      id: userInfo.id ?? undefined,
      username: userInfo.username,
      email: userInfo.email,
      address: userInfo.address,
      phone: userInfo.phone,
      password: userInfo.password,
      date: new Date(userInfo?.date?.toString().split('T')[0] ?? ""),
      year: userInfo.year,
      expertise: userInfo.expertise ?? '',
      gender: userInfo.gender,
      terms: userInfo.terms,
    },
    onSubmit: async (values) => {
      const file = values.file[0];
      if (file) {
        const uploadedFileUrl = await uploadFileToSupabase(file);
        if (uploadedFileUrl) {
          setProfilePictureUrl(uploadedFileUrl);
          values.profilePictureUrl = uploadedFileUrl;
          const { profilePictureUrl, id, ...rest } = values;
          if (JSON.parse(localStorage.getItem('adimis-schema-form-user-registration-form') ?? "").id > 0) {
            const { error } = await supabase.from('users').upsert({
              id: Number(JSON.parse(localStorage.getItem('adimis-schema-form-user-registration-form') ?? "").id),
              ...rest,
              file: uploadedFileUrl,
              expertise: rest.expertise.split(','),
            });
            if (error) {
              return;
            }

          }
          else {
            const { data, error } = await supabase.from('users').insert({
              ...rest,
              file: uploadedFileUrl,
              expertise: rest.expertise.split(','),
            }).select("*")
            const { file, ...restData } = data?.[0] ?? {};
            if (error) {
              return;
            }
            if (data && data.length > 0 && data[0].id) {
              localStorage.setItem('adimis-schema-form-user-registration-form', JSON.stringify({
                ...restData, profilePicture: restData.file,
              }));
              setUserInfo(data[0]);
            }
          }
        }
      }
    },
    onInvalidSubmit: (values) => {
      console.log('On Submit Invalid Example Form Response: ', JSON.stringify(values, null, 4));
    },
  };
  return (
    <ThemeProvider defaultTheme="dark">
      <FormixFormProvider {...schemaFormProps}>
        <FormBody>
          <FormContent className='h-[450px] overflow-hidden'>
            <FormHeader>
              <FormTitle />
              <FormDescription />
            </FormHeader>
            <FormFlexFields fluid columns={1} className='flex justify-center sm:m-3 m-1 items-center overflow-scroll h-[346px]' />
          </FormContent>
          <FormFooter>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Submit
            </button>
          </FormFooter>
        </FormBody>

      </FormixFormProvider>
    </ThemeProvider>
  );
};

export default App;