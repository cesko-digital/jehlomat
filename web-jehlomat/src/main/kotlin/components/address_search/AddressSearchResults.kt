package components.address_search

import kotlinx.css.*
import kotlinx.css.properties.borderBottom
import kotlinx.html.js.onClickFunction
import react.*
import services.places.AutocompleteResponse
import styled.css
import styled.styledDiv
import styled.styledImg

fun RBuilder.addressSearchResult(
    results: List<AutocompleteResponse>,
    showAsHistory: Boolean,
    isLoading: Boolean,
    selectedAddress: (AutocompleteResponse) -> Unit
): ReactElement = child(
    component = addressSearchResults,
    props = AddressSearchResultsProps(results, showAsHistory, isLoading, selectedAddress)
)

private val addressSearchResults = functionalComponent<AddressSearchResultsProps> { props ->

    if (props.isLoading) {
        styledDiv {
            css {
                margin(left = 22.px)
                padding(vertical = 22.px)
                backgroundColor = Color.white
                borderBottomLeftRadius = 10.px

                display = Display.flex
                justifyContent = JustifyContent.center
                alignItems = Align.center
            }
            styledImg(src = "/images/refresh-icon.svg") {
                css {
                    width = 44.px
                    height = 44.px
                }
            }
        }
    } else {
        styledDiv {
            css {
                margin(left = 22.px)
                display = Display.flex
                flexDirection = FlexDirection.column

                backgroundColor = Color.white

                borderBottomLeftRadius = 10.px

                hover {
                    cursor = Cursor.pointer
                }
            }
            props.results.forEachIndexed { index, autocompleteResponse ->
                styledDiv {
                    attrs {
                        key = index.toString()

                        onClickFunction = {
                            props.onSelectedAddress(autocompleteResponse)
                        }
                    }
                    css {
                        height = 50.px

                        display = Display.flex
                        flexDirection = FlexDirection.row
                        alignItems = Align.center
                    }
                    if (props.showAsHistory) {
                        styledImg(src = "/images/history-clock.svg") {
                            css {
                                width = 20.px
                                height = 20.px

                                margin(horizontal = 10.px)
                            }
                        }
                    } else {
                        styledDiv {
                            css {
                                width = 22.px
                            }
                        }
                    }

                    styledDiv {
                        css {
                            display = Display.flex
                            flexDirection = FlexDirection.column
                            alignItems = Align.start
                            justifyContent = JustifyContent.spaceEvenly

                            height = 100.pct
                            width = 100.pct
                            flexGrow = 1.0

                            if (index != props.results.lastIndex) {
                                borderBottom(
                                    width = 1.px,
                                    color = Color("#707070").withAlpha(0.25),
                                    style = BorderStyle.solid
                                )
                            }
                        }
                        styledDiv {
                            css {
                                fontSize = 13.px
                                fontWeight = FontWeight.w700
                            }
                            +autocompleteResponse.getStreet()
                        }
                        styledDiv {
                            css {
                                fontSize = 10.px
                                fontWeight = FontWeight.normal
                            }
                            +autocompleteResponse.getCity()
                        }
                    }
                }
            }
        }
    }
}

private data class AddressSearchResultsProps(
    val results: List<AutocompleteResponse>,
    val showAsHistory: Boolean,
    val isLoading: Boolean,
    val onSelectedAddress: (AutocompleteResponse) -> Unit
) : RProps