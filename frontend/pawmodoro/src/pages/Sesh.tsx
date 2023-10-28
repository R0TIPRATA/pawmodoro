import { DateTime } from "luxon";
import Timer from "../components/Timer"

const Sesh = () => {
  
  const calculateTime = (expireDate) => {
    const date = DateTime.fromJSDate(expireDate);
    const now = DateTime.now();
    const diff = now.diff(date);
    return diff.as("seconds")
  }

  return (
    <div>
      <Timer />
    </div>
  )
}

export default Sesh