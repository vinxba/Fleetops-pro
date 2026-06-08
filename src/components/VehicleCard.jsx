const VehicleCard = ({ vehicle }) => {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl p-5 shadow-sm hover:shadow-lg transition">

      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">
          {vehicle.name}
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-sm
          ${
            vehicle.status === "Ready"
              ? "bg-green-100 text-green-700"
              : vehicle.status === "Repair"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {vehicle.status}
        </span>
      </div>

      <p className="text-gray-500 mt-1">
        {vehicle.category}
      </p>

      <div className="mt-5 space-y-3">

        <div>
          <div className="flex justify-between text-sm">
            <span>Fuel Level</span>
            <span>{vehicle.fuel}%</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
            <div
              className="h-2 bg-blue-600 rounded-full"
              style={{ width: `${vehicle.fuel}%` }}
            />
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Mileage
          </p>

          <p className="font-semibold">
            {vehicle.mileage.toLocaleString()} KM
          </p>
        </div>

      </div>
    </div>
  );
};

export default VehicleCard; 