Projeto de Scraping utilizando Node.js, Yarn e Puppeteer para coleta de notícias no site Orquestra Ouro Preto. 

Como pode ser visto no [link]([http://www.orquestraouropreto.com.br/site/noticias/](http://www.orquestraouropreto.com.br/site/noticias/), as notícias são organizadas na forma de cards.



![allnews.jpeg](C:\Users\kodag\AppData\Roaming\marktext\images\1d8951614a3dce4994ce3b0733b5a512e6b66529.jpeg)



Esses cards ao serem clicados levam para outra página, com mais informações. 



![newsdetails.jpeg](C:\Users\kodag\AppData\Roaming\marktext\images\929a5633e8a4b3d4218aacf4b663a70b1bf5ea06.jpeg)



Nessa páginas são adquiridos os dados: título da notícia, subtítulo da notícia, autor da notícia, data de publicação, url da imagem em destaque e conteúdo.



Cada página possui 10 notícias, e é necessário caminhar pelas páginas, de forma a obter todas. 



O algoritmo, inicialmente, adquire as urls de todas as notícias disponíveis. O próximo passo é caminhar pelas urls selecionadas, aquirindo os dados citados acima, que são posteriormente salvos em um arquivo .csv que pode ser aberto por leitores de tabelas.



![tabela.jpeg](C:\Users\kodag\AppData\Roaming\marktext\images\5e28d6fc421f2938e0b6a589bf01fa2f55def540.jpeg)



