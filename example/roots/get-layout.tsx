import styles from './../domains/get-layout/get-layout.module.css'
import GetLayout from '../domains/get-layout'

function GetLayoutPage() {
  return <GetLayout />
}

GetLayoutPage.getLayout = (page) => <div className={styles.layout}>admkakasdkmsad{page}</div>

export default GetLayoutPage
