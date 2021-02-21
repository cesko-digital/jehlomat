package app

import org.koin.dsl.module
import services.GoogleMapsPlaces
import services.IPlaces
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