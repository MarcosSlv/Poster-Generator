function HeaderComponent({ title }) {
  return (
    <div className="container mx-auto my-2">
      <div className="flex justify-center">
        <div className="w-full lg:w-auto">
          <h2 className="text-center font-bold text-white text-4xl m-2">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default HeaderComponent;