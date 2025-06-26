FROM ubuntu:24.10

RUN apt-get update -yqq && apt-get upgrade -yqq
RUN apt-get install -yqq dotnet-sdk-9.0
RUN apt-get install -yqq aspnetcore-runtime-9.0
RUN apt-get install -yqq curl

WORKDIR /app
COPY *.csproj .
RUN dotnet restore
COPY . .

EXPOSE 5000

CMD ["dotnet", "watch", "--no-hot-reload"]