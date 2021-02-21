package app

import org.koin.dsl.module
import services.GoogleMapsPlaces
import services.IPlaces
import utils.IConfig
import utils.LocalConfig

val localModule = module {
    single<IConfig> {
        LocalConfig()
    }

    single<IPlaces> {
        GoogleMapsPlaces(
            googleMapsKey = get<IConfig>().get().googleMapsKey
        )
    }
}