import styles from './SearchResult.module.scss';
import { DataInterface } from '../../utils';

interface Props {
  value: string,
  data: DataInterface[]
}

const getHighlightedText = (text: string, highlight: string) => {
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  return parts.map((part, i) => {
    if (part.toLowerCase() === highlight.toLowerCase()) {
      return <mark key={i}>{part}</mark>
    }
    
    return part;
  })
}

const SearchResult: React.FC<Props> = ({ value, data }) => {
  return (
    <div className={styles.container}>
      {data.map(product => (
        <div key={product.id} className={styles.product}>
          <img className={styles.thumbnail} src={product.thumbnail} alt="" />
          <div className={styles.info}>
            <div className={styles.title}>{getHighlightedText(product.title, value)}</div>
            <div className={styles.description}>{getHighlightedText(product.description, value)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SearchResult;
