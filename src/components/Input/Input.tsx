import loaderSrc from '../../assets/icons/loader.svg';
import styles from './Input.module.scss';

interface Props {
  value: string,
  isLoading: boolean,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

// Input is a pure component that can be reused
// It depend only on props
const Input: React.FC<Props> = ({ value, isLoading, onChange }) => {
  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          placeholder="Search..."
          className={styles.input}
          value={value}
          onChange={onChange}
        />
        {isLoading && <img className={styles.loader} src={loaderSrc} alt="" />}
      </div>
    </div>
  )
}

export default Input;
