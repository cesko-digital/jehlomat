package app

import org.koin.dsl.module
import services.places.GoogleMapsPlaces
import services.places.IPlaces
import utils.IConfig
import utils.ProductionConfig

val productionModule = module {
    single<IConfig> {
        ProductionConfig()
    }

    single<IPlaces> {
        GoogleMapsPlaces(
            googleMapsKey = get<IConfig>().get().googleMapsKey
        )
    }
}