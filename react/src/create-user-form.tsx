import {
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from 'react';

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

function CreateUserForm({
  setUserWasCreated,
}: CreateUserFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [validationErrors, setValidationErrors] =
    useState<string[]>([]);

  const [apiError, setApiError] = useState('');

  const [loading, setLoading] = useState(false);

  function validatePassword(
    password: string
  ): string[] {
    const errors: string[] = [];

    if (password.length < 10) {
      errors.push(
        'Password must be at least 10 characters long'
      );
    }

    if (password.length > 24) {
      errors.push(
        'Password must be at most 24 characters long'
      );
    }

    if (password.includes(' ')) {
      errors.push(
        'Password cannot contain spaces'
      );
    }

    if (!/[0-9]/.test(password)) {
      errors.push(
        'Password must contain at least one number'
      );
    }

    if (!/[A-Z]/.test(password)) {
      errors.push(
        'Password must contain at least one uppercase letter'
      );
    }

    if (!/[a-z]/.test(password)) {
      errors.push(
        'Password must contain at least one lowercase letter'
      );
    }

    return errors;
  }

  function handlePasswordChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const newPassword = e.target.value;

    setPassword(newPassword);

    const errors =
      validatePassword(newPassword);

    setValidationErrors(errors);
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setApiError('');

    const errors =
      validatePassword(password);

    setValidationErrors(errors);

    if (!username.trim()) {
      return;
    }

    if (errors.length > 0) {
      return;
    }

    try {
      setLoading(true);

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsic3VyZXNocGFsc2luZ2hwYW53YXI4NDIxQGdtYWlsLmNvbSJdLCJpc3MiOiJoZW5uZ2UtYWRtaXNzaW9uLWNoYWxsZW5nZSIsInN1YiI6ImNoYWxsZW5nZSJ9.UCssMTCHHRYVef2rrKd1UzBZKvJFEvf3jCocmZbRwEs';

      const response = await fetch(
        'https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (response.ok) {
        setUserWasCreated(true);
        return;
      }

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        setApiError(
          'Not authenticated to access this resource.'
        );
        return;
      }

      if (response.status === 400) {
        setApiError(
          'Sorry, the entered password is not allowed, please try a different one.'
        );
        return;
      }

      setApiError(
        'Something went wrong, please try again.'
      );
    } catch {
      setApiError(
        'Something went wrong, please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={formWrapper}>
      <form
        style={form}
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="username"
          style={formLabel}
        >
          Username
        </label>

        <input
          id="username"
          aria-label="Username"
          style={formInput}
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <label
          htmlFor="password"
          style={formLabel}
        >
          Password
        </label>

        <input
          id="password"
          aria-label="Password"
          type="password"
          style={formInput}
          value={password}
          onChange={handlePasswordChange}
        />

        {validationErrors.length > 0 && (
          <ul style={errorList}>
            {validationErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}

        {apiError && (
          <p style={apiErrorStyle}>
            {apiError}
          </p>
        )}

        <button
          type="submit"
          style={formButton}
          disabled={loading}
        >
          {loading
            ? 'Creating...'
            : 'Create User'}
        </button>
      </form>
    </div>
  );
}

export { CreateUserForm };

const formWrapper: CSSProperties = {
  maxWidth: '500px',
  width: '80%',
  backgroundColor: '#efeef5',
  padding: '24px',
  borderRadius: '8px',
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const formLabel: CSSProperties = {
  fontWeight: 700,
};

const formInput: CSSProperties = {
  outline: 'none',
  padding: '8px 16px',
  height: '40px',
  fontSize: '14px',
  backgroundColor: '#f8f7fa',
  border:
    '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
};

const formButton: CSSProperties = {
  outline: 'none',
  borderRadius: '4px',
  border:
    '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#7135d2',
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  height: '40px',
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '8px',
  alignSelf: 'flex-end',
  cursor: 'pointer',
};

const errorList: CSSProperties = {
  margin: 0,
  paddingLeft: '20px',
  color: '#cc0000',
  fontSize: '14px',
};

const apiErrorStyle: CSSProperties = {
  color: '#cc0000',
  fontSize: '14px',
  fontWeight: 600,
};