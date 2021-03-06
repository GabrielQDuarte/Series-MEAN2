import { Component, AfterViewInit } from "@angular/core";
import { Favorite } from "../favorite";
import { FavoriteService } from "../favorite.service";
import "rxjs/add/operator/map";

@Component({
    selector: "app-favoritos",
    templateUrl: "./favoritos.component.html",
    styleUrls: ["./favoritos.component.scss"]
})
export class FavoritosComponent implements AfterViewInit {
    series: Favorite[] = [];
    seriesView: [Favorite[]];

    constructor(private favoriteService: FavoriteService) { }

    ngAfterViewInit() {
        this.pesquisarFavoritos();
    }

    pesquisarFavoritos(): void {
        this.favoriteService.PesquisarFavoritos().subscribe(data => {
            this.series = [];
            this.seriesView = [null];

            if (!data || Object.prototype.toString.call(data) !== "[object Array]") {
                return;
            }

            data.forEach(x => {
                let serie: Favorite = {
                    id: x._id,
                    nome: x.nome as string || "Nome não definido.",
                    sinopse: x.sinopse as string || "Sinopse não definida.",
                    bannerUrl: x.bannerUrl,
                    idApi: x.idApi as number,
                    isFavorito: true
                };

                this.favoriteService.PesquisarPorIdApi(serie.idApi).subscribe(y => {
                    serie.isFavorito = !!y;
                });

                this.series.push(serie);
            });

            let chunk = 3;
            let temparray = [];
            for (let i = 0; i < this.series.length; i += chunk) {
                temparray = this.series.slice(i, i + chunk);
                this.seriesView.push(temparray);
            }
        });
    }
}
