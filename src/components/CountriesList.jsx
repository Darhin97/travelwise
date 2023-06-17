import styles from "./CountryList.module.css";
import Message from "./Message";
import Spinner from "./spinner/Spinner";

const CountriesList = () => {
    const { isLoading, cities } = props;

    if (isLoading) {
      return <Spinner />;
    }
  
    if (!cities.length) {
      return (
        <Message
          message={"Add your first city by clicking on a city on the map"}
        />
      );
    }
    return (
      <ul className={styles.CountriesList}>
        {cities.map((city) => (
          <CityItem city={city} key={city.id} />
        ))}
      </ul>
    );
  };
};

export default CountriesList;
